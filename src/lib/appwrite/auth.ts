/**
 * @fileoverview Auth helpers — login, logout, OAuth, getCurrentUser, assignRole.
 */
"use server"

import { ID, OAuthProvider } from "node-appwrite"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createAdminClient, createSessionClient, createGuestClient } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import type { Role } from "@/config/roles"

const COOKIE_NAME = `a_session_${APPWRITE_CONFIG.projectId}`

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    const { account } = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password)

    ;(await cookies()).set(COOKIE_NAME, session.secret, {
      ...COOKIE_OPTIONS,
      expires: new Date(session.expire),
    })
  } catch (err) {
    console.error("SignIn error:", err)
    return { error: "Invalid credentials" }
  }

  redirect("/app/dashboard")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  try {
    const { account } = await createAdminClient()
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

  redirect("/app/dashboard")
}

export async function signOut() {
  try {
    const { account } = await createSessionClient()
    await account.deleteSession("current")
  } catch {
    // Session may already be gone
  } finally {
    ;(await cookies()).delete(COOKIE_NAME)
    redirect("/auth/login")
  }
}

export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
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
