/**
 * @fileoverview Auth helpers — login, logout, OAuth, getCurrentUser, assignRole.
 */
"use server"

import { ID } from "node-appwrite"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createAdminClient, createSessionClient, createGuestClient, getLoggedInUser } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { getPublicAppUrl } from "@/lib/env"
import type { Role } from "@/config/roles"

const COOKIE_NAME = `a_session_${APPWRITE_CONFIG.projectId}`
const FALLBACK_COOKIE_NAME = "a_session_console"

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
}

function sanitizeRedirectPath(redirectTo?: string | null) {
  if (!redirectTo) return "/app/dashboard"
  if (!redirectTo.startsWith("/")) return "/app/dashboard"
  if (redirectTo.startsWith("//")) return "/app/dashboard"
  if (redirectTo.startsWith("/auth")) return "/app/dashboard"
  return redirectTo
}

export async function signIn(formData: FormData, redirectTo?: string | null) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const { account } = await createGuestClient()
    const session = await account.createEmailPasswordSession(email, password)

    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
  } catch (err) {
    console.error("SignIn error:", err)
    return { error: "Invalid credentials" }
  }

  redirect(sanitizeRedirectPath(redirectTo))
}

export async function signUp(formData: FormData, redirectTo?: string | null) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  try {
    const { account } = await createGuestClient()
    await account.create(ID.unique(), email, password, name)
    const session = await account.createEmailPasswordSession(email, password)

    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
  } catch (err) {
    console.error("SignUp error:", err)
    return { error: "Failed to create account" }
  }

  redirect(sanitizeRedirectPath(redirectTo))
}

export async function signOut() {
  try {
    const { account } = await createSessionClient()
    await account.deleteSession("current")
  } catch {
    // Session may already be gone
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

/** Assign a role label to a user (admin-only) */
export async function assignRole(userId: string, role: Role) {
  const { users } = await createAdminClient()
  const user = await users.get(userId)
  const labels = new Set(user.labels ?? [])
  labels.add(role)
  await users.updateLabels(userId, Array.from(labels))
}

/** Remove a role label from a user (admin-only) */
export async function removeRole(userId: string, role: Role) {
  const { users } = await createAdminClient()
  const user = await users.get(userId)
  const labels = (user.labels ?? []).filter((l: string) => l !== role)
  await users.updateLabels(userId, labels)
}

/** Create an OAuth session from callback params */
export async function createOAuthSession(userId: string, secret: string) {
  const { account } = await createAdminClient()
  try {
    const session = await account.createSession(userId, secret)
    ;(await cookies()).set(COOKIE_NAME, session.secret, COOKIE_OPTIONS)
    return { success: true }
  } catch {
    return { error: "Failed to create session" }
  }
}

/** Request password recovery email */
export async function requestPasswordRecovery(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  if (!email) return { error: "Email is required" }

  try {
    const { account } = await createGuestClient()
    const redirectUrl = `${getPublicAppUrl()}/auth/reset-password`
    await account.createRecovery(email, redirectUrl)
    return { success: true }
  } catch (err) {
    console.error("requestPasswordRecovery error:", err)
    return { error: "Could not send reset link" }
  }
}

/** Complete password recovery with userId + secret from email link */
export async function completePasswordRecovery(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim()
  const secret = String(formData.get("secret") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const confirmPassword = String(formData.get("confirmPassword") ?? "")

  if (!userId || !secret) {
    return { error: "Invalid or expired reset link" }
  }

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  try {
    const { account } = await createGuestClient()
    await account.updateRecovery(userId, secret, password)
  } catch (err) {
    console.error("completePasswordRecovery error:", err)
    return { error: "Failed to reset password" }
  }

  redirect("/auth/login?reset=success")
}
