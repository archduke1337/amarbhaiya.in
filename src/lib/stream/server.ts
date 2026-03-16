/**
 * @fileoverview Server-side Stream token generation.
 * Generates user tokens for Stream Video & Chat using the Stream Node SDK.
 */
import { StreamClient } from "@stream-io/node-sdk"

/**
 * Generate a Stream user token (server-side only).
 * Call from an API route handler, never from client code.
 */
export async function generateStreamToken(userId: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
  const apiSecret = process.env.STREAM_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("Stream credentials not configured")
  }

  // Initialize the Stream Server client
  const serverClient = new StreamClient(apiKey, apiSecret)

  // Generate a token with a 1-hour validity period (3600 seconds)
  // The SDK automatically handles claims (iat, user_id) and signing.
  const token = serverClient.generateUserToken({ 
    user_id: userId, 
    validity_in_seconds: 3600 
  })

  return token
}
