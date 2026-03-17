/**
 * @fileoverview Environment validation and URL resolution.
 * Uses Zod to validate all required env vars at import time.
 * If a required var is missing, the app fails fast with a clear error.
 */
import { z } from "zod"

// ─── URL Resolution ─────────────────────────────────────────────────────────

function withHttps(hostOrUrl: string) {
  if (hostOrUrl.startsWith("http://") || hostOrUrl.startsWith("https://")) {
    return hostOrUrl
  }

  return `https://${hostOrUrl}`
}

export function getPublicAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL
  if (explicit) return withHttps(explicit)

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (productionHost) return withHttps(productionHost)

  const previewHost = process.env.VERCEL_URL
  if (previewHost) return withHttps(previewHost)

  return "http://localhost:3000"
}

// ─── Zod Env Validation ─────────────────────────────────────────────────────

const nonEmpty = z.string().min(1)

/** Server-side env vars — validated once when first imported */
const serverEnvSchema = z.object({
  // Appwrite
  NEXT_PUBLIC_APPWRITE_ENDPOINT: nonEmpty,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: nonEmpty,
  APPWRITE_API_KEY: nonEmpty,
  APPWRITE_DATABASE_ID: nonEmpty,

  // Collections (25)
  APPWRITE_COLLECTION_USERS: nonEmpty,
  APPWRITE_COLLECTION_COURSES: nonEmpty,
  APPWRITE_COLLECTION_CATEGORIES: nonEmpty,
  APPWRITE_COLLECTION_MODULES: nonEmpty,
  APPWRITE_COLLECTION_LESSONS: nonEmpty,
  APPWRITE_COLLECTION_RESOURCES: nonEmpty,
  APPWRITE_COLLECTION_ENROLLMENTS: nonEmpty,
  APPWRITE_COLLECTION_PROGRESS: nonEmpty,
  APPWRITE_COLLECTION_QUIZZES: nonEmpty,
  APPWRITE_COLLECTION_QUIZ_QUESTIONS: nonEmpty,
  APPWRITE_COLLECTION_QUIZ_ATTEMPTS: nonEmpty,
  APPWRITE_COLLECTION_ASSIGNMENTS: nonEmpty,
  APPWRITE_COLLECTION_SUBMISSIONS: nonEmpty,
  APPWRITE_COLLECTION_CERTIFICATES: nonEmpty,
  APPWRITE_COLLECTION_LIVE_SESSIONS: nonEmpty,
  APPWRITE_COLLECTION_SESSION_RSVPS: nonEmpty,
  APPWRITE_COLLECTION_COURSE_COMMENTS: nonEmpty,
  APPWRITE_COLLECTION_FORUM_CATEGORIES: nonEmpty,
  APPWRITE_COLLECTION_FORUM_THREADS: nonEmpty,
  APPWRITE_COLLECTION_FORUM_REPLIES: nonEmpty,
  APPWRITE_COLLECTION_PAYMENTS: nonEmpty,
  APPWRITE_COLLECTION_SUBSCRIPTIONS: nonEmpty,
  APPWRITE_COLLECTION_MODERATION_ACTIONS: nonEmpty,
  APPWRITE_COLLECTION_AUDIT_LOGS: nonEmpty,
  APPWRITE_COLLECTION_NOTIFICATIONS: nonEmpty,
  APPWRITE_COLLECTION_COURSE_REVIEWS: nonEmpty,

  // Buckets (6)
  APPWRITE_BUCKET_COURSE_VIDEOS: nonEmpty,
  APPWRITE_BUCKET_COURSE_THUMBNAILS: nonEmpty,
  APPWRITE_BUCKET_LESSON_RESOURCES: nonEmpty,
  APPWRITE_BUCKET_CERTIFICATES: nonEmpty,
  APPWRITE_BUCKET_AVATARS: nonEmpty,
  APPWRITE_BUCKET_BLOG_IMAGES: nonEmpty,
})

/**
 * Validate server env vars. Called once on first import.
 * Skips validation during build (NEXT_PHASE=phase-production-build)
 * to avoid failing CI when secrets aren't available.
 */
function validateServerEnv() {
  // Skip during next build phase (env vars may not be available)
  if (process.env.NEXT_PHASE === "phase-production-build") return

  const result = serverEnvSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join(".")).join(", ")
    console.error(
      `\n❌ Missing or invalid environment variables:\n   ${missing}\n\n   Copy .env.example to .env.local and fill in all values.\n`
    )
    // Don't crash in dev — log loudly. In production, crash.
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing environment variables: ${missing}`)
    }
  }
}

// Run validation on first import (server-side only)
if (typeof window === "undefined") {
  validateServerEnv()
}
