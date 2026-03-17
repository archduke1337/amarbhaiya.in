const fs = require("fs")
const path = require("path")
const { Client, Databases } = require("node-appwrite")

const ROOT = process.cwd()
const ENV_FILES = [path.join(ROOT, ".env"), path.join(ROOT, ".env.local")]

function parseEnv(content) {
  const env = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const idx = trimmed.indexOf("=")
    if (idx <= 0) continue
    const key = trimmed.slice(0, idx).trim()
    env[key] = trimmed.slice(idx + 1).trim().replace(/^['\"]|['\"]$/g, "")
  }
  return env
}

function loadEnv() {
  const merged = {}
  for (const file of ENV_FILES) {
    if (fs.existsSync(file)) Object.assign(merged, parseEnv(fs.readFileSync(file, "utf8")))
  }
  Object.assign(merged, process.env)
  return merged
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function ensureAttribute(databases, databaseId, collectionId, attribute, existingKeys) {
  if (existingKeys.has(attribute.key)) return { created: false }

  const { type, key, required = false } = attribute
  const defaultValue = required ? undefined : attribute.default

  if (type === "string") {
    await databases.createStringAttribute(
      databaseId,
      collectionId,
      key,
      attribute.size || 255,
      required,
      defaultValue,
      attribute.array || false,
      false
    )
  } else if (type === "integer") {
    await databases.createIntegerAttribute(
      databaseId,
      collectionId,
      key,
      required,
      attribute.min ?? undefined,
      attribute.max ?? undefined,
      defaultValue,
      attribute.array || false
    )
  } else if (type === "double") {
    await databases.createFloatAttribute(
      databaseId,
      collectionId,
      key,
      required,
      attribute.min ?? undefined,
      attribute.max ?? undefined,
      defaultValue,
      attribute.array || false
    )
  } else if (type === "boolean") {
    await databases.createBooleanAttribute(
      databaseId,
      collectionId,
      key,
      required,
      defaultValue,
      attribute.array || false
    )
  } else if (type === "datetime") {
    await databases.createDatetimeAttribute(
      databaseId,
      collectionId,
      key,
      required,
      defaultValue,
      attribute.array || false
    )
  } else {
    throw new Error(`Unsupported attribute type '${type}' for ${collectionId}.${key}`)
  }

  return { created: true }
}

async function createIndexWithRetry(databases, databaseId, collectionId, index, existingIndexKeys) {
  if (existingIndexKeys.has(index.key)) return { created: false }

  const maxAttempts = 12
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await databases.createIndex(
        databaseId,
        collectionId,
        index.key,
        index.type || "key",
        index.attributes,
        index.orders || index.attributes.map(() => "ASC")
      )
      return { created: true }
    } catch (err) {
      const msg = String(err && err.message ? err.message : err)
      const shouldRetry = /attribute|not available|processing|not found|failed/i.test(msg)
      if (!shouldRetry || attempt === maxAttempts) {
        throw err
      }
      await sleep(1500)
    }
  }
  return { created: false }
}

function schema(env) {
  return [
    {
      id: env.APPWRITE_COLLECTION_USERS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "name", type: "string", size: 150, required: true },
        { key: "email", type: "string", size: 255, required: true },
        { key: "phone", type: "string", size: 30 },
        { key: "avatarFileId", type: "string", size: 64 },
        { key: "bio", type: "string", size: 5000 },
        { key: "headline", type: "string", size: 255 },
        { key: "website", type: "string", size: 500 },
        { key: "socialLinks", type: "string", size: 8000 },
        { key: "labels", type: "string", size: 32, array: true },
        { key: "isVerified", type: "boolean", default: false },
        { key: "isActive", type: "boolean", default: true },
        { key: "lastLoginAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_users_userId", attributes: ["userId"] },
        { key: "idx_users_email", attributes: ["email"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_COURSES,
      attributes: [
        { key: "title", type: "string", size: 255, required: true },
        { key: "slug", type: "string", size: 255, required: true },
        { key: "tagline", type: "string", size: 500 },
        { key: "description", type: "string", size: 20000 },
        { key: "thumbnailFileId", type: "string", size: 64 },
        { key: "instructorId", type: "string", size: 64, required: true },
        { key: "categoryId", type: "string", size: 64, required: true },
        { key: "level", type: "string", size: 32, required: true },
        { key: "status", type: "string", size: 32, required: true, default: "draft" },
        { key: "price", type: "double", required: true, default: 0 },
        { key: "discountPrice", type: "double" },
        { key: "currency", type: "string", size: 8, required: true, default: "INR" },
        { key: "duration", type: "string", size: 100 },
        { key: "totalLessons", type: "integer", default: 0 },
        { key: "totalModules", type: "integer", default: 0 },
        { key: "enrollmentCount", type: "integer", default: 0 },
        { key: "tags", type: "string", size: 80, array: true },
        { key: "isFeatured", type: "boolean", default: false },
      ],
      indexes: [
        { key: "idx_courses_slug", type: "unique", attributes: ["slug"] },
        { key: "idx_courses_status", attributes: ["status"] },
        { key: "idx_courses_categoryId", attributes: ["categoryId"] },
        { key: "idx_courses_instructorId", attributes: ["instructorId"] },
        { key: "idx_courses_title_fulltext", type: "fulltext", attributes: ["title"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_CATEGORIES,
      attributes: [
        { key: "name", type: "string", size: 120, required: true },
        { key: "slug", type: "string", size: 120, required: true },
        { key: "description", type: "string", size: 2000 },
        { key: "order", type: "integer", default: 0 },
        { key: "isActive", type: "boolean", default: true },
      ],
      indexes: [
        { key: "idx_categories_slug", type: "unique", attributes: ["slug"] },
        { key: "idx_categories_isActive", attributes: ["isActive"] },
        { key: "idx_categories_order", attributes: ["order"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_MODULES,
      attributes: [
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "title", type: "string", size: 255, required: true },
        { key: "description", type: "string", size: 5000 },
        { key: "order", type: "integer", default: 0 },
        { key: "isPublished", type: "boolean", default: false },
      ],
      indexes: [
        { key: "idx_modules_courseId", attributes: ["courseId"] },
        { key: "idx_modules_course_order", attributes: ["courseId", "order"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_LESSONS,
      attributes: [
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "moduleId", type: "string", size: 64, required: true },
        { key: "title", type: "string", size: 255, required: true },
        { key: "type", type: "string", size: 32, default: "video" },
        { key: "summary", type: "string", size: 5000 },
        { key: "content", type: "string", size: 20000 },
        { key: "videoFileId", type: "string", size: 64 },
        { key: "duration", type: "string", size: 100 },
        { key: "order", type: "integer", default: 0 },
        { key: "isFree", type: "boolean", default: false },
        { key: "isPublished", type: "boolean", default: false },
      ],
      indexes: [
        { key: "idx_lessons_courseId", attributes: ["courseId"] },
        { key: "idx_lessons_moduleId", attributes: ["moduleId"] },
        { key: "idx_lessons_course_order", attributes: ["courseId", "order"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_RESOURCES,
      attributes: [
        { key: "lessonId", type: "string", size: 64, required: true },
        { key: "title", type: "string", size: 255, required: true },
        { key: "fileId", type: "string", size: 64, required: true },
        { key: "fileType", type: "string", size: 80, required: true },
        { key: "fileSize", type: "integer", required: true, default: 0 },
      ],
      indexes: [{ key: "idx_resources_lessonId", attributes: ["lessonId"] }],
    },
    {
      id: env.APPWRITE_COLLECTION_ENROLLMENTS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "paymentId", type: "string", size: 64 },
        { key: "enrolledAt", type: "datetime", required: true },
        { key: "status", type: "string", size: 32, required: true, default: "active" },
        { key: "completedAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_enrollments_userId", attributes: ["userId"] },
        { key: "idx_enrollments_courseId", attributes: ["courseId"] },
        { key: "idx_enrollments_user_course", type: "unique", attributes: ["userId", "courseId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_PROGRESS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "lessonId", type: "string", size: 64, required: true },
        { key: "isCompleted", type: "boolean", default: false },
        { key: "completedAt", type: "datetime" },
        { key: "watchTimeSeconds", type: "integer", default: 0 },
      ],
      indexes: [
        { key: "idx_progress_user_course", attributes: ["userId", "courseId"] },
        { key: "idx_progress_user_course_lesson", type: "unique", attributes: ["userId", "courseId", "lessonId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_QUIZZES,
      attributes: [
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "lessonId", type: "string", size: 64 },
        { key: "title", type: "string", size: 255, required: true },
        { key: "description", type: "string", size: 5000 },
        { key: "passingScore", type: "integer", default: 0 },
        { key: "timeLimit", type: "integer" },
        { key: "isPublished", type: "boolean", default: false },
      ],
      indexes: [{ key: "idx_quizzes_courseId", attributes: ["courseId"] }],
    },
    {
      id: env.APPWRITE_COLLECTION_QUIZ_QUESTIONS,
      attributes: [
        { key: "quizId", type: "string", size: 64, required: true },
        { key: "type", type: "string", size: 32, required: true },
        { key: "question", type: "string", size: 5000, required: true },
        { key: "options", type: "string", size: 1000, array: true },
        { key: "correctAnswer", type: "string", size: 1000, required: true },
        { key: "explanation", type: "string", size: 5000 },
        { key: "points", type: "integer", default: 1 },
        { key: "order", type: "integer", default: 0 },
      ],
      indexes: [
        { key: "idx_quiz_questions_quizId", attributes: ["quizId"] },
        { key: "idx_quiz_questions_quiz_order", attributes: ["quizId", "order"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_QUIZ_ATTEMPTS,
      attributes: [
        { key: "quizId", type: "string", size: 64, required: true },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "answers", type: "string", size: 20000 },
        { key: "score", type: "double", default: 0 },
        { key: "passed", type: "boolean", default: false },
        { key: "startedAt", type: "datetime", required: true },
        { key: "completedAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_quiz_attempts_user_quiz", attributes: ["userId", "quizId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_ASSIGNMENTS,
      attributes: [
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "lessonId", type: "string", size: 64 },
        { key: "title", type: "string", size: 255, required: true },
        { key: "description", type: "string", size: 20000, required: true },
        { key: "dueDate", type: "datetime" },
        { key: "maxScore", type: "integer", default: 100 },
        { key: "isPublished", type: "boolean", default: false },
      ],
      indexes: [{ key: "idx_assignments_courseId", attributes: ["courseId"] }],
    },
    {
      id: env.APPWRITE_COLLECTION_SUBMISSIONS,
      attributes: [
        { key: "assignmentId", type: "string", size: 64, required: true },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "content", type: "string", size: 20000, required: true },
        { key: "fileId", type: "string", size: 64 },
        { key: "score", type: "double" },
        { key: "feedback", type: "string", size: 5000 },
        { key: "submittedAt", type: "datetime", required: true },
        { key: "gradedAt", type: "datetime" },
      ],
      indexes: [{ key: "idx_submissions_assignment_user", attributes: ["assignmentId", "userId"] }],
    },
    {
      id: env.APPWRITE_COLLECTION_CERTIFICATES,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "certificateFileId", type: "string", size: 64 },
        { key: "issuedAt", type: "datetime", required: true },
        { key: "certificateNumber", type: "string", size: 120 },
      ],
      indexes: [
        { key: "idx_certificates_userId", attributes: ["userId"] },
        { key: "idx_certificates_user_course", type: "unique", attributes: ["userId", "courseId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_LIVE_SESSIONS,
      attributes: [
        { key: "title", type: "string", size: 255, required: true },
        { key: "description", type: "string", size: 5000 },
        { key: "instructorId", type: "string", size: 64, required: true },
        { key: "courseId", type: "string", size: 64 },
        { key: "streamCallId", type: "string", size: 120, required: true },
        { key: "streamChannelId", type: "string", size: 120, required: true },
        { key: "scheduledAt", type: "datetime", required: true },
        { key: "startedAt", type: "datetime" },
        { key: "endedAt", type: "datetime" },
        { key: "status", type: "string", size: 32, required: true, default: "scheduled" },
        { key: "maxParticipants", type: "integer" },
        { key: "isRecorded", type: "boolean", default: false },
        { key: "recordingUrl", type: "string", size: 2000 },
        { key: "thumbnailFileId", type: "string", size: 64 },
      ],
      indexes: [
        { key: "idx_live_sessions_instructor", attributes: ["instructorId"] },
        { key: "idx_live_sessions_status", attributes: ["status"] },
        { key: "idx_live_sessions_scheduledAt", attributes: ["scheduledAt"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_SESSION_RSVPS,
      attributes: [
        { key: "sessionId", type: "string", size: 64, required: true },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "status", type: "string", size: 32, required: true, default: "attending" },
        { key: "joinedAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_session_rsvps_session", attributes: ["sessionId"] },
        { key: "idx_session_rsvps_user_session", type: "unique", attributes: ["userId", "sessionId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_COURSE_COMMENTS,
      attributes: [
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "lessonId", type: "string", size: 64 },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "parentId", type: "string", size: 64 },
        { key: "content", type: "string", size: 20000, required: true },
        { key: "isEdited", type: "boolean", default: false },
        { key: "isFlagged", type: "boolean", default: false },
        { key: "isDeleted", type: "boolean", default: false },
      ],
      indexes: [
        { key: "idx_course_comments_lesson", attributes: ["lessonId"] },
        { key: "idx_course_comments_flagged", attributes: ["isFlagged"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_FORUM_CATEGORIES,
      attributes: [
        { key: "name", type: "string", size: 120, required: true },
        { key: "slug", type: "string", size: 120, required: true },
        { key: "description", type: "string", size: 2000 },
        { key: "order", type: "integer", default: 0 },
        { key: "isActive", type: "boolean", default: true },
      ],
      indexes: [
        { key: "idx_forum_categories_slug", type: "unique", attributes: ["slug"] },
        { key: "idx_forum_categories_active_order", attributes: ["isActive", "order"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_FORUM_THREADS,
      attributes: [
        { key: "categoryId", type: "string", size: 64, required: true },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "title", type: "string", size: 255, required: true },
        { key: "content", type: "string", size: 20000, required: true },
        { key: "isPinned", type: "boolean", default: false },
        { key: "isLocked", type: "boolean", default: false },
        { key: "isFlagged", type: "boolean", default: false },
        { key: "replyCount", type: "integer", default: 0 },
        { key: "lastReplyAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_forum_threads_category", attributes: ["categoryId"] },
        { key: "idx_forum_threads_flagged", attributes: ["isFlagged"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_FORUM_REPLIES,
      attributes: [
        { key: "threadId", type: "string", size: 64, required: true },
        { key: "userId", type: "string", size: 64, required: true },
        { key: "content", type: "string", size: 20000, required: true },
        { key: "isEdited", type: "boolean", default: false },
        { key: "isFlagged", type: "boolean", default: false },
        { key: "isDeleted", type: "boolean", default: false },
      ],
      indexes: [
        { key: "idx_forum_replies_thread", attributes: ["threadId"] },
        { key: "idx_forum_replies_flagged", attributes: ["isFlagged"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_PAYMENTS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "amount", type: "double", required: true, default: 0 },
        { key: "currency", type: "string", size: 8, required: true, default: "INR" },
        { key: "method", type: "string", size: 32, default: "razorpay" },
        { key: "status", type: "string", size: 32, required: true, default: "pending" },
        { key: "gatewayOrderId", type: "string", size: 120 },
        { key: "gatewayPaymentId", type: "string", size: 120 },
        { key: "gatewaySignature", type: "string", size: 255 },
        { key: "receiptId", type: "string", size: 120 },
        { key: "couponCode", type: "string", size: 80 },
        { key: "discountAmount", type: "double", default: 0 },
        { key: "notes", type: "string", size: 5000 },
        { key: "paidAt", type: "datetime" },
        { key: "refundedAt", type: "datetime" },
        { key: "razorpayPaymentId", type: "string", size: 120 },
        { key: "phonePeTransactionId", type: "string", size: 120 },
      ],
      indexes: [
        { key: "idx_payments_user", attributes: ["userId"] },
        { key: "idx_payments_course", attributes: ["courseId"] },
        { key: "idx_payments_status", attributes: ["status"] },
        { key: "idx_payments_gateway_order", attributes: ["gatewayOrderId"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_SUBSCRIPTIONS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "planId", type: "string", size: 64, required: true },
        { key: "status", type: "string", size: 32, required: true },
        { key: "startDate", type: "datetime", required: true },
        { key: "endDate", type: "datetime", required: true },
        { key: "paymentId", type: "string", size: 64, required: true },
      ],
      indexes: [{ key: "idx_subscriptions_user", attributes: ["userId"] }],
    },
    {
      id: env.APPWRITE_COLLECTION_MODERATION_ACTIONS,
      attributes: [
        { key: "targetUserId", type: "string", size: 64, required: true },
        { key: "moderatorId", type: "string", size: 64, required: true },
        { key: "action", type: "string", size: 64, required: true },
        { key: "reason", type: "string", size: 5000, required: true },
        { key: "targetType", type: "string", size: 64, required: true, default: "user" },
        { key: "targetId", type: "string", size: 64, required: true },
        { key: "expiresAt", type: "datetime" },
        { key: "isReverted", type: "boolean", default: false },
        { key: "revertedBy", type: "string", size: 64 },
        { key: "revertedAt", type: "datetime" },
        { key: "status", type: "string", size: 32, default: "pending" },
      ],
      indexes: [
        { key: "idx_moderation_actions_targetUser", attributes: ["targetUserId"] },
        { key: "idx_moderation_actions_status", attributes: ["status"] },
        { key: "idx_moderation_actions_action", attributes: ["action"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_AUDIT_LOGS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "action", type: "string", size: 120, required: true },
        { key: "targetType", type: "string", size: 64, required: true },
        { key: "targetId", type: "string", size: 64, required: true },
        { key: "metadata", type: "string", size: 20000 },
        { key: "ipAddress", type: "string", size: 64 },
      ],
      indexes: [
        { key: "idx_audit_logs_user", attributes: ["userId"] },
        { key: "idx_audit_logs_action", attributes: ["action"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_NOTIFICATIONS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "type", type: "string", size: 64, required: true },
        { key: "title", type: "string", size: 255, required: true },
        { key: "message", type: "string", size: 5000, required: true },
        { key: "linkUrl", type: "string", size: 1000 },
        { key: "isRead", type: "boolean", default: false },
        { key: "readAt", type: "datetime" },
      ],
      indexes: [
        { key: "idx_notifications_user", attributes: ["userId"] },
        { key: "idx_notifications_user_created", attributes: ["userId", "$createdAt"] },
      ],
    },
    {
      id: env.APPWRITE_COLLECTION_COURSE_REVIEWS,
      attributes: [
        { key: "userId", type: "string", size: 64, required: true },
        { key: "userName", type: "string", size: 180 },
        { key: "courseId", type: "string", size: 64, required: true },
        { key: "rating", type: "integer", required: true, min: 1, max: 5 },
        { key: "comment", type: "string", size: 5000 },
        { key: "status", type: "string", size: 32, default: "approved" },
      ],
      indexes: [
        { key: "idx_reviews_course", attributes: ["courseId"] },
        { key: "idx_reviews_user_course", attributes: ["userId", "courseId"] },
      ],
    },
  ]
}

async function main() {
  const env = loadEnv()

  const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const apiKey = env.APPWRITE_API_KEY
  const databaseId = env.APPWRITE_DATABASE_ID

  if (!endpoint || !projectId || !apiKey || !databaseId) {
    throw new Error("Missing Appwrite config in env: endpoint/project/api key/database id")
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
  const databases = new Databases(client)

  const collections = schema(env)
  let createdAttributes = 0
  let createdIndexes = 0

  for (const collection of collections) {
    if (!collection.id) {
      throw new Error(`Missing collection id for schema entry`)
    }

    const attrs = await databases.listAttributes(databaseId, collection.id)
    const existingAttrKeys = new Set((attrs.attributes || []).map((a) => a.key))

    for (const attribute of collection.attributes) {
      const result = await ensureAttribute(databases, databaseId, collection.id, attribute, existingAttrKeys)
      if (result.created) {
        createdAttributes += 1
        existingAttrKeys.add(attribute.key)
      }
    }

    await sleep(2000)

    const idx = await databases.listIndexes(databaseId, collection.id)
    const existingIndexKeys = new Set((idx.indexes || []).map((i) => i.key))

    for (const index of collection.indexes) {
      const result = await createIndexWithRetry(databases, databaseId, collection.id, index, existingIndexKeys)
      if (result.created) {
        createdIndexes += 1
        existingIndexKeys.add(index.key)
      }
    }
  }

  console.log("[setup-appwrite-schema] Completed")
  console.log(`[setup-appwrite-schema] Attributes created: ${createdAttributes}`)
  console.log(`[setup-appwrite-schema] Indexes created: ${createdIndexes}`)
}

module.exports = {
  loadEnv,
  schema,
}

if (require.main === module) {
  main().catch((err) => {
    console.error("[setup-appwrite-schema] Failed:", err.message)
    process.exit(1)
  })
}
