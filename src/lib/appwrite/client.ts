/**
 * @fileoverview Client-side Appwrite SDK — Account, Databases, Storage, Functions.
 * Used in client components. Never expose API keys here.
 */
import { Client, Account, Databases, Storage, Functions } from "appwrite"
import { APPWRITE_CONFIG } from "@/config/appwrite"

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)

export default client
