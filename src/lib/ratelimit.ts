/**
 * @fileoverview Rate limiting implementation for API endpoints.
 * Uses memory-based storage for development, can be switched to Upstash Redis for production.
 */

interface RateLimitWindow {
  count: number
  resetTime: number
}

// In-memory store for rate limits (key: identifier, value: window data)
const rateLimitStore = new Map<string, RateLimitWindow>()

/**
 * Rate limit configuration
 */
export const RATE_LIMIT_CONFIG = {
  // Public endpoints: 30 requests per minute
  PUBLIC: { limit: 100, windowMs: 60 * 1000 },
  
  // Auth endpoints (login, register): 5 requests per 15 minutes
  AUTH: { limit: 50, windowMs: 15 * 60 * 1000 },
  
  // API endpoints (authenticated): 60 requests per minute
  API: { limit: 200, windowMs: 60 * 1000 },
  
  // Webhook endpoints: 100 requests per minute
  WEBHOOK: { limit: 1000, windowMs: 60 * 1000 },
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with { success: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  config: { limit: number; windowMs: number }
): {
  success: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = identifier

  // Get or create window
  let window = rateLimitStore.get(key)

  // Reset window if expired
  if (!window || now >= window.resetTime) {
    window = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    rateLimitStore.set(key, window)
  }

  // Check if limit exceeded
  const isUnderLimit = window.count < config.limit
  window.count++

  // Clean up old entries (prevent memory leak)
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now >= v.resetTime) {
        rateLimitStore.delete(k)
      }
    }
  }

  return {
    success: isUnderLimit,
    remaining: Math.max(0, config.limit - window.count),
    resetTime: window.resetTime,
  }
}

/**
 * Get IP address from request
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  const realIP = headers.get("x-real-ip")
  if (realIP) return realIP

  return "unknown"
}

/**
 * Get user ID from request (if authenticated)
 */
export function getUserID(headers: Headers): string | null {
  const cookie = headers.get("cookie") || ""
  
  // Extract session ID from cookies if available
  const sessionMatch = cookie.match(/a_session_[^=]+=([^;]+)/)
  if (sessionMatch) {
    return sessionMatch[1].substring(0, 20) // Use part of session as unique ID
  }

  return null
}

/**
 * Get identifier for rate limiting (prefer user ID, fall back to IP)
 */
export function getRateLimitIdentifier(headers: Headers): string {
  const userID = getUserID(headers)
  if (userID) return `user:${userID}`

  const ip = getClientIP(headers)
  return `ip:${ip}`
}
