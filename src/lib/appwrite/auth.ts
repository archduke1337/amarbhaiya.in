/**
 * @fileoverview Auth helpers — login, logout, OAuth, getCurrentUser, assignRole.
 * All server actions include input validation and proper error handling.
 */
"use server"

import { ID } from "node-appwrite"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createAdminClient, createSessionClient, createGuestClient, getLoggedInUser } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { getPublicAppUrl } from "@/lib/env"
import { ROLES, type Role } from "@/config/roles"

const COOKIE_NAME = `a_session_${APPWRITE_CONFIG.projectId}`
const FALLBACK_COOKIE_NAME = "a_session_console"

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365, // 1 year fallback; overridden by expires when available
}

// ─── Validation Schemas ──────────────────────────────────────────────────────

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(256, "Password is too long"),
})

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(128, "Name is too long")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password is too long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const recoveryRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
})

const recoveryCompleteSchema = z.object({
  userId: z.string().trim().min(1, "Invalid or expired reset link"),
  secret: z.string().trim().min(1, "Invalid or expired reset link"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password is too long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const VALID_ROLES = Object.values(ROLES) as string[]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanitizeRedirectPath(redirectTo?: string | null) {
  if (!redirectTo) return "/app/dashboard"
  if (!redirectTo.startsWith("/")) return "/app/dashboard"
  if (redirectTo.startsWith("//")) return "/app/dashboard"
  if (redirectTo.startsWith("/auth")) return "/app/dashboard"
  // Block protocol-relative and data URIs
  if (/^\/[^a-z]/i.test(redirectTo) && redirectTo.startsWith("//")) return "/app/dashboard"
  return redirectTo
}

function extractFormData(formData: FormData, fields: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  for (const field of fields) {
    result[field] = String(formData.get(field) ?? "")
  }
  return result
}

// ─── Auth Actions ────────────────────────────────────────────────────────────

export async function signIn(formData: FormData, redirectTo?: string | null) {
  const raw = extractFormData(formData, ["email", "password"])
  const parsed = signInSchema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input"
    return { error: firstError }
  }

  const { email, password } = parsed.data

  try {
    const { account } = await createGuestClient()
    const session = await account.createEmailPasswordSession(email, password)

    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
  } catch (err) {
    console.error("SignIn error:", err)
    return { error: "Invalid email or password" }
  }

  redirect(sanitizeRedirectPath(redirectTo))
}

export async function signUp(formData: FormData, redirectTo?: string | null) {
  const raw = extractFormData(formData, ["name", "email", "password", "confirmPassword"])
  const parsed = signUpSchema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input"
    return { error: firstError }
  }

  const { name, email, password } = parsed.data

  try {
    const { account } = await createGuestClient()
    const user = await account.create(ID.unique(), email, password, name)
    
    // Create the user profile in the database
    const { databases } = await createAdminClient()
    await databases.createDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.users,
      user.$id,
      {
        userId: user.$id,
        name: name,
        email: email,
        labels: ["student"], // default role
        isVerified: false,
        isActive: true,
      }
    )

    const session = await account.createEmailPasswordSession(email, password)

    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
  } catch (err: any) {
    console.error("SignUp error:", err)
    // Appwrite returns 409 for duplicate email
    if (err?.code === 409 || err?.type === "user_already_exists") {
      return { error: "An account with this email already exists" }
    }
    // Appwrite returns 400 for invalid email/password format
    if (err?.code === 400) {
      return { error: "Invalid email or password format" }
    }
    return { error: "Failed to create account. Please try again." }
  }

  redirect(sanitizeRedirectPath(redirectTo))
}

export async function signOut() {
  try {
    const { account } = await createSessionClient()
    await account.deleteSession("current")
  } catch {
    // Session may already be gone — still clear cookies
  } finally {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    cookieStore.delete(FALLBACK_COOKIE_NAME)
    redirect("/auth/login")
  }
}

export async function getCurrentUser() {
  return getLoggedInUser()
}

// ─── Role Management (admin-only) ───────────────────────────────────────────

/** Assign a role label to a user (admin-only) */
export async function assignRole(userId: string, role: Role) {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels?.includes(ROLES.ADMIN)) {
    throw new Error("Unauthorized: admin access required")
  }

  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid role")
  }

  const { users } = await createAdminClient()
  const user = await users.get(userId)
  const labels = new Set(user.labels ?? [])
  labels.add(role)
  await users.updateLabels(userId, Array.from(labels))
}

/** Remove a role label from a user (admin-only) */
export async function removeRole(userId: string, role: Role) {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels?.includes(ROLES.ADMIN)) {
    throw new Error("Unauthorized: admin access required")
  }

  if (!VALID_ROLES.includes(role)) {
    throw new Error("Invalid role")
  }

  const { users } = await createAdminClient()
  const user = await users.get(userId)
  const labels = (user.labels ?? []).filter((l: string) => l !== role)
  await users.updateLabels(userId, labels)
}

// ─── OAuth ───────────────────────────────────────────────────────────────────

/** Create an OAuth session from callback params */
export async function createOAuthSession(userId: string, secret: string) {
  if (!userId || !secret) {
    return { error: "Missing OAuth credentials" }
  }

  try {
    const { account } = await createAdminClient()
    const session = await account.createSession(userId, secret)
    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
    return { success: true }
  } catch (err) {
    console.error("createOAuthSession error:", err)
    return { error: "Failed to create session" }
  }
}

// ─── Password Recovery ───────────────────────────────────────────────────────

/** Request password recovery email */
export async function requestPasswordRecovery(formData: FormData) {
  const raw = extractFormData(formData, ["email"])
  const parsed = recoveryRequestSchema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input"
    return { error: firstError }
  }

  try {
    const { account } = await createGuestClient()
    const redirectUrl = `${getPublicAppUrl()}/auth/reset-password`
    await account.createRecovery(parsed.data.email, redirectUrl)
    return { success: true }
  } catch (err) {
    console.error("requestPasswordRecovery error:", err)
    // Always return success to prevent email enumeration
    return { success: true }
  }
}

/** Complete password recovery with userId + secret from email link */
export async function completePasswordRecovery(formData: FormData) {
  const raw = extractFormData(formData, ["userId", "secret", "password", "confirmPassword"])
  const parsed = recoveryCompleteSchema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input"
    return { error: firstError }
  }

  const { userId, secret, password } = parsed.data

  try {
    const { account } = await createGuestClient()
    await account.updateRecovery(userId, secret, password)
  } catch (err) {
    console.error("completePasswordRecovery error:", err)
    return { error: "Failed to reset password. The link may have expired." }
  }

  redirect("/auth/login?reset=success")
}
