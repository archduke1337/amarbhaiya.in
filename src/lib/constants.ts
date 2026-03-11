/**
 * @fileoverview App-wide constants — names, pagination, rate limits.
 */

export const APP_NAME = "Amarnath Bhaiya"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const PAGINATION_LIMIT = 25
export const MAX_PAGINATION_LIMIT = 100

export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MS: 15 * 60 * 1000,
  API_CALLS_PER_MINUTE: 60,
} as const

export const COOKIE_NAME = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""}`
export const FALLBACK_COOKIE_NAME = "a_session_console"

export const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"]
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
export const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
