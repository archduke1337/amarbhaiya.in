/**
 * @fileoverview Appwrite configuration — all collection IDs, bucket IDs, and database ID.
 * Sync these with your Appwrite console. Never hardcode IDs elsewhere.
 */

export const APPWRITE_CONFIG = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "fallback-project-id",
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "fallback-db-id",

  /** 25 Collections */
  collections: {
    users: process.env.APPWRITE_COLLECTION_USERS!,
    courses: process.env.APPWRITE_COLLECTION_COURSES!,
    categories: process.env.APPWRITE_COLLECTION_CATEGORIES!,
    modules: process.env.APPWRITE_COLLECTION_MODULES!,
    lessons: process.env.APPWRITE_COLLECTION_LESSONS!,
    resources: process.env.APPWRITE_COLLECTION_RESOURCES!,
    enrollments: process.env.APPWRITE_COLLECTION_ENROLLMENTS!,
    progress: process.env.APPWRITE_COLLECTION_PROGRESS!,
    quizzes: process.env.APPWRITE_COLLECTION_QUIZZES!,
    quizQuestions: process.env.APPWRITE_COLLECTION_QUIZ_QUESTIONS!,
    quizAttempts: process.env.APPWRITE_COLLECTION_QUIZ_ATTEMPTS!,
    assignments: process.env.APPWRITE_COLLECTION_ASSIGNMENTS!,
    submissions: process.env.APPWRITE_COLLECTION_SUBMISSIONS!,
    certificates: process.env.APPWRITE_COLLECTION_CERTIFICATES!,
    liveSessions: process.env.APPWRITE_COLLECTION_LIVE_SESSIONS!,
    sessionRsvps: process.env.APPWRITE_COLLECTION_SESSION_RSVPS!,
    courseComments: process.env.APPWRITE_COLLECTION_COURSE_COMMENTS!,
    forumCategories: process.env.APPWRITE_COLLECTION_FORUM_CATEGORIES!,
    forumThreads: process.env.APPWRITE_COLLECTION_FORUM_THREADS!,
    forumReplies: process.env.APPWRITE_COLLECTION_FORUM_REPLIES!,
    payments: process.env.APPWRITE_COLLECTION_PAYMENTS!,
    subscriptions: process.env.APPWRITE_COLLECTION_SUBSCRIPTIONS!,
    moderationActions: process.env.APPWRITE_COLLECTION_MODERATION_ACTIONS!,
    auditLogs: process.env.APPWRITE_COLLECTION_AUDIT_LOGS!,
    notifications: process.env.APPWRITE_COLLECTION_NOTIFICATIONS!,
    courseReviews: process.env.APPWRITE_COLLECTION_COURSE_REVIEWS!,
  },

  /** 6 Storage Buckets */
  buckets: {
    courseVideos: process.env.APPWRITE_BUCKET_COURSE_VIDEOS!,
    courseThumbnails: process.env.APPWRITE_BUCKET_COURSE_THUMBNAILS!,
    lessonResources: process.env.APPWRITE_BUCKET_LESSON_RESOURCES!,
    certificates: process.env.APPWRITE_BUCKET_CERTIFICATES!,
    avatars: process.env.APPWRITE_BUCKET_AVATARS!,
    blogImages: process.env.APPWRITE_BUCKET_BLOG_IMAGES!,
  },
} as const

export type CollectionKey = keyof typeof APPWRITE_CONFIG.collections
export type BucketKey = keyof typeof APPWRITE_CONFIG.buckets
