/**
 * @fileoverview Server-side Appwrite SDK with API key — for server components and API routes.
 * Uses node-appwrite. Session clients read cookies; admin clients use the API key.
 */
import { Client, Account, Databases, Storage, Users } from "node-appwrite"
import { cookies } from "next/headers"
import { APPWRITE_CONFIG } from "@/config/appwrite"

const COOKIE_PREFIX = "a_session_"
const FALLBACK_COOKIE = "a_session_console"

/** Create a session-scoped client from the current user's cookie */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)

  const cookieStore = await cookies()
  const session =
    cookieStore.get(`${COOKIE_PREFIX}${APPWRITE_CONFIG.projectId}`) ??
    cookieStore.get(FALLBACK_COOKIE)

  if (!session?.value) {
    throw new Error("No session")
  }

  client.setSession(session.value)

  return {
    get account() { return new Account(client) },
    get databases() { return new Databases(client) },
    get storage() { return new Storage(client) },
  }
}

/** Create an admin client using the API key — full access */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setKey(APPWRITE_CONFIG.apiKey)

  return {
    get account() { return new Account(client) },
    get databases() { return new Databases(client) },
    get storage() { return new Storage(client) },
    get users() { return new Users(client) },
  }
}

/** Get current logged-in user or null */
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient()
    return await account.get()
  } catch {
    return null
  }
}
