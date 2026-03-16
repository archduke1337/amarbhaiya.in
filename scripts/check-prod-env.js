/* eslint-disable no-console */
/**
 * @fileoverview Production env validator for Vercel deployments.
 */

const fs = require("fs")
const path = require("path")

function parseEnv(content) {
  const env = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    env[key] = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "")
  }
  return env
}

function loadEnvFromFiles() {
  const root = process.cwd()
  const files = [path.join(root, ".env"), path.join(root, ".env.local")]
  const merged = {}

  for (const file of files) {
    if (fs.existsSync(file)) {
      Object.assign(merged, parseEnv(fs.readFileSync(file, "utf8")))
    }
  }

  Object.assign(merged, process.env)
  return merged
}

const required = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_APPWRITE_ENDPOINT",
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "APPWRITE_DATABASE_ID",
  "APPWRITE_COLLECTION_USERS",
  "APPWRITE_COLLECTION_COURSES",
  "APPWRITE_COLLECTION_CATEGORIES",
  "APPWRITE_COLLECTION_MODULES",
  "APPWRITE_COLLECTION_LESSONS",
  "APPWRITE_COLLECTION_RESOURCES",
  "APPWRITE_COLLECTION_ENROLLMENTS",
  "APPWRITE_COLLECTION_PROGRESS",
  "APPWRITE_COLLECTION_QUIZZES",
  "APPWRITE_COLLECTION_QUIZ_QUESTIONS",
  "APPWRITE_COLLECTION_QUIZ_ATTEMPTS",
  "APPWRITE_COLLECTION_ASSIGNMENTS",
  "APPWRITE_COLLECTION_SUBMISSIONS",
  "APPWRITE_COLLECTION_CERTIFICATES",
  "APPWRITE_COLLECTION_LIVE_SESSIONS",
  "APPWRITE_COLLECTION_SESSION_RSVPS",
  "APPWRITE_COLLECTION_COURSE_COMMENTS",
  "APPWRITE_COLLECTION_FORUM_CATEGORIES",
  "APPWRITE_COLLECTION_FORUM_THREADS",
  "APPWRITE_COLLECTION_FORUM_REPLIES",
  "APPWRITE_COLLECTION_PAYMENTS",
  "APPWRITE_COLLECTION_SUBSCRIPTIONS",
  "APPWRITE_COLLECTION_MODERATION_ACTIONS",
  "APPWRITE_COLLECTION_AUDIT_LOGS",
  "APPWRITE_COLLECTION_NOTIFICATIONS",
  "APPWRITE_COLLECTION_COURSE_REVIEWS",
  "APPWRITE_BUCKET_COURSE_VIDEOS",
  "APPWRITE_BUCKET_COURSE_THUMBNAILS",
  "APPWRITE_BUCKET_LESSON_RESOURCES",
  "APPWRITE_BUCKET_CERTIFICATES",
  "APPWRITE_BUCKET_AVATARS",
  "APPWRITE_BUCKET_BLOG_IMAGES",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "RAZORPAY_WEBHOOK_SECRET",
  "PHONEPE_MERCHANT_ID",
  "PHONEPE_SALT_KEY",
  "PHONEPE_SALT_INDEX",
  "PHONEPE_ENV",
  "WEBHOOK_ENROLLMENT_OWNER",
  "NEXT_PUBLIC_STREAM_API_KEY",
  "STREAM_API_SECRET",
]

const optionalButRecommended = [
  "RAZORPAY_WEBHOOK_APP_SECRET",
  "PHONEPE_WEBHOOK_APP_SECRET",
  "ADMIN_EMAILS",
  "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
  "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
  "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
]

function main() {
  const env = loadEnvFromFiles()
  const missing = required.filter((key) => !env[key] || String(env[key]).trim() === "")

  if (missing.length > 0) {
    console.error("\n[check-prod-env] Missing required environment variables:\n")
    for (const key of missing) {
      console.error(`- ${key}`)
    }
    console.error("\nSet these values in Vercel Project Settings -> Environment Variables and retry.\n")
    process.exit(1)
  }

  const url = env.NEXT_PUBLIC_APP_URL || ""
  if (!/^https:\/\//.test(url)) {
    console.error("\n[check-prod-env] NEXT_PUBLIC_APP_URL must start with https:// in production.\n")
    process.exit(1)
  }

  const webhookOwner = env.WEBHOOK_ENROLLMENT_OWNER
  if (webhookOwner !== "next" && webhookOwner !== "appwrite-function") {
    console.error("\n[check-prod-env] WEBHOOK_ENROLLMENT_OWNER must be either 'next' or 'appwrite-function'.\n")
    process.exit(1)
  }

  const missingRecommended = optionalButRecommended.filter((key) => !env[key] || String(env[key]).trim() === "")
  if (missingRecommended.length > 0) {
    console.warn("\n[check-prod-env] Optional but recommended variables are missing:\n")
    for (const key of missingRecommended) {
      console.warn(`- ${key}`)
    }
    console.warn("")
  }

  console.log("\n[check-prod-env] Environment looks good for production deployment.\n")
}

main()
