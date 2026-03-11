/**
 * @fileoverview Server-side Stream token generation.
 * Generates user tokens for Stream Video & Chat using the API secret.
 */

// TODO: Install package: @stream-io/node-sdk

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

  // Using manual JWT generation until @stream-io/node-sdk is installed
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const now = Math.floor(Date.now() / 1000)
  const payload = Buffer.from(
    JSON.stringify({ user_id: userId, iat: now, exp: now + 3600 })
  ).toString("base64url")

  const { createHmac } = await import("crypto")
  const signature = createHmac("sha256", apiSecret)
    .update(`${header}.${payload}`)
    .digest("base64url")

  return `${header}.${payload}.${signature}`
}
