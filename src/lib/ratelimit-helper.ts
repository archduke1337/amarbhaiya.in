/**
 * @fileoverview Rate limit helper for API routes
 */

import { NextRequest, NextResponse } from "next/server"
import {
  RATE_LIMIT_CONFIG,
  checkRateLimit,
  getRateLimitIdentifier,
} from "@/lib/ratelimit"

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIG

/**
 * Enforce rate limit on API route
 * Returns rate limit response if exceeded, null if under limit
 */
export function enforceRateLimit(
  req: NextRequest,
  type: RateLimitType = "API"
): NextResponse | null {
  const identifier = getRateLimitIdentifier(req.headers)
  const config = RATE_LIMIT_CONFIG[type]
  
  const result = checkRateLimit(identifier, config)

  // Add rate limit headers to response
  const headers = {
    "X-RateLimit-Limit": String(config.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetTime / 1000)),
  }

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers,
      }
    )
  }

  // Store headers for later addition to successful response
  ;(req as any).rateLimitHeaders = headers

  return null
}

/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(response: NextResponse, req: NextRequest): NextResponse {
  const headers = (req as any).rateLimitHeaders || {}
  
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, String(value))
  })

  return response
}
