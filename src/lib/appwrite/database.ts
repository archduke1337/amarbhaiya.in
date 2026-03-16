/**
 * @fileoverview Database query helpers for all 25 collections.
 * Centralizes all Appwrite Database queries. Use these instead of raw SDK calls.
 */
import { Query } from "node-appwrite"
import { getDatabases } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"

const { databaseId, collections } = APPWRITE_CONFIG

type ListParams = {
  queries?: string[]
  limit?: number
  offset?: number
  useAdmin?: boolean
}

// ─── Generic Helpers ──────────────────────────────

async function listDocuments(collectionId: string, params: ListParams = {}, useAdmin = false) {
  const databases = await getDatabases(params.useAdmin || useAdmin)
  const queries = [...(params.queries ?? [])]
  if (params.limit) queries.push(Query.limit(params.limit))
  if (params.offset) queries.push(Query.offset(params.offset))
  return databases.listDocuments(databaseId, collectionId, queries)
}

async function getDocument(collectionId: string, documentId: string, useAdmin = false) {
  const databases = await getDatabases(useAdmin)
  return databases.getDocument(databaseId, collectionId, documentId)
}

async function createDocument(collectionId: string, documentId: string, data: Record<string, unknown>, useAdmin = false) {
  const databases = await getDatabases(useAdmin)
  return databases.createDocument(databaseId, collectionId, documentId, data)
}

async function updateDocument(collectionId: string, documentId: string, data: Record<string, unknown>, useAdmin = false) {
  const databases = await getDatabases(useAdmin)
  return databases.updateDocument(databaseId, collectionId, documentId, data)
}

async function deleteDocument(collectionId: string, documentId: string, useAdmin = false) {
  const databases = await getDatabases(useAdmin)
  return databases.deleteDocument(databaseId, collectionId, documentId)
}

// ─── Users ────────────────────────────────────────

export const usersDb = {
  list: (params?: ListParams) => listDocuments(collections.users, { ...params, useAdmin: true }),
  get: (id: string, useAdmin = true) => getDocument(collections.users, id, useAdmin),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.users, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.users, id, data, true),
}

// ─── Courses ──────────────────────────────────────

export const coursesDb = {
  list: (params?: ListParams) => listDocuments(collections.courses, params),
  get: (id: string, useAdmin = false) => getDocument(collections.courses, id, useAdmin),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.courses, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.courses, id, data, true),
  delete: (id: string) => deleteDocument(collections.courses, id, true),
  getBySlug: async (slug: string) => {
    const result = await listDocuments(collections.courses, { queries: [Query.equal("slug", slug)], limit: 1 })
    return result.documents[0] ?? null
  },
  listPublished: (params?: ListParams) =>
    listDocuments(collections.courses, { ...params, queries: [Query.equal("status", "published"), ...(params?.queries ?? [])] }),
  listByInstructor: (instructorId: string, params?: ListParams) =>
    listDocuments(collections.courses, { ...params, queries: [Query.equal("instructorId", instructorId), ...(params?.queries ?? [])] }),
}

// ─── Categories ───────────────────────────────────

export const categoriesDb = {
  list: (params?: ListParams) => listDocuments(collections.categories, params),
  get: (id: string) => getDocument(collections.categories, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.categories, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.categories, id, data, true),
  delete: (id: string) => deleteDocument(collections.categories, id, true),
}

// ─── Modules ──────────────────────────────────────

export const modulesDb = {
  list: (params?: ListParams) => listDocuments(collections.modules, params),
  get: (id: string) => getDocument(collections.modules, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.modules, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.modules, id, data, true),
  delete: (id: string) => deleteDocument(collections.modules, id, true),
  listByCourse: (courseId: string) =>
    listDocuments(collections.modules, { queries: [Query.equal("courseId", courseId), Query.orderAsc("order")] }),
}

// ─── Lessons ──────────────────────────────────────

export const lessonsDb = {
  list: (params?: ListParams) => listDocuments(collections.lessons, params),
  get: (id: string) => getDocument(collections.lessons, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.lessons, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.lessons, id, data, true),
  delete: (id: string) => deleteDocument(collections.lessons, id, true),
  listByModule: (moduleId: string) =>
    listDocuments(collections.lessons, { queries: [Query.equal("moduleId", moduleId), Query.orderAsc("order")] }),
  listByCourse: (courseId: string) =>
    listDocuments(collections.lessons, { queries: [Query.equal("courseId", courseId), Query.orderAsc("order")] }),
}

// ─── Resources ────────────────────────────────────

export const resourcesDb = {
  list: (params?: ListParams) => listDocuments(collections.resources, params),
  get: (id: string) => getDocument(collections.resources, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.resources, id, data, true),
  delete: (id: string) => deleteDocument(collections.resources, id, true),
  listByLesson: (lessonId: string) =>
    listDocuments(collections.resources, { queries: [Query.equal("lessonId", lessonId)] }),
}

// ─── Enrollments ──────────────────────────────────

export const enrollmentsDb = {
  list: (params?: ListParams) => listDocuments(collections.enrollments, params),
  get: (id: string) => getDocument(collections.enrollments, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.enrollments, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.enrollments, id, data, true),
  getByUserAndCourse: async (userId: string, courseId: string) => {
    const result = await listDocuments(collections.enrollments, {
      queries: [Query.equal("userId", userId), Query.equal("courseId", courseId)],
      limit: 1,
      useAdmin: true
    })
    return result.documents[0] ?? null
  },
  listByUser: (userId: string, params?: ListParams) =>
    listDocuments(collections.enrollments, { ...params, queries: [Query.equal("userId", userId), ...(params?.queries ?? [])] }),
  listByCourse: (courseId: string, params?: ListParams) =>
    listDocuments(collections.enrollments, { ...params, queries: [Query.equal("courseId", courseId), ...(params?.queries ?? [])], useAdmin: true }),
}

// ─── Progress ─────────────────────────────────────

export const progressDb = {
  list: (params?: ListParams) => listDocuments(collections.progress, params),
  get: (id: string) => getDocument(collections.progress, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.progress, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.progress, id, data),
  getByUserCourseLesson: async (userId: string, courseId: string, lessonId: string) => {
    const result = await listDocuments(collections.progress, {
      queries: [Query.equal("userId", userId), Query.equal("courseId", courseId), Query.equal("lessonId", lessonId)],
      limit: 1,
    })
    return result.documents[0] ?? null
  },
  listByUserAndCourse: (userId: string, courseId: string) =>
    listDocuments(collections.progress, { queries: [Query.equal("userId", userId), Query.equal("courseId", courseId)] }),
}

// ─── Quizzes ──────────────────────────────────────

export const quizzesDb = {
  list: (params?: ListParams) => listDocuments(collections.quizzes, params),
  get: (id: string) => getDocument(collections.quizzes, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.quizzes, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.quizzes, id, data, true),
  delete: (id: string) => deleteDocument(collections.quizzes, id, true),
  listByCourse: (courseId: string) =>
    listDocuments(collections.quizzes, { queries: [Query.equal("courseId", courseId)] }),
}

export const quizQuestionsDb = {
  list: (params?: ListParams) => listDocuments(collections.quizQuestions, params),
  get: (id: string) => getDocument(collections.quizQuestions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.quizQuestions, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.quizQuestions, id, data, true),
  delete: (id: string) => deleteDocument(collections.quizQuestions, id, true),
  listByQuiz: (quizId: string) =>
    listDocuments(collections.quizQuestions, { queries: [Query.equal("quizId", quizId), Query.orderAsc("order")] }),
}

export const quizAttemptsDb = {
  list: (params?: ListParams) => listDocuments(collections.quizAttempts, params),
  get: (id: string) => getDocument(collections.quizAttempts, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.quizAttempts, id, data),
  listByUserAndQuiz: (userId: string, quizId: string) =>
    listDocuments(collections.quizAttempts, { queries: [Query.equal("userId", userId), Query.equal("quizId", quizId)] }),
}

// ─── Assignments & Submissions ────────────────────

export const assignmentsDb = {
  list: (params?: ListParams) => listDocuments(collections.assignments, params),
  get: (id: string) => getDocument(collections.assignments, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.assignments, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.assignments, id, data, true),
  delete: (id: string) => deleteDocument(collections.assignments, id, true),
}

export const submissionsDb = {
  list: (params?: ListParams) => listDocuments(collections.submissions, params),
  get: (id: string) => getDocument(collections.submissions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.submissions, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.submissions, id, data),
}

// ─── Certificates ─────────────────────────────────

export const certificatesDb = {
  list: (params?: ListParams) => listDocuments(collections.certificates, params),
  get: (id: string) => getDocument(collections.certificates, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.certificates, id, data, true),
  listByUser: (userId: string) =>
    listDocuments(collections.certificates, { queries: [Query.equal("userId", userId)] }),
}

// ─── Live Sessions ────────────────────────────────

export const liveSessionsDb = {
  list: (params?: ListParams) => listDocuments(collections.liveSessions, params),
  get: (id: string) => getDocument(collections.liveSessions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.liveSessions, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.liveSessions, id, data, true),
  delete: (id: string) => deleteDocument(collections.liveSessions, id, true),
  listUpcoming: () =>
    listDocuments(collections.liveSessions, { queries: [Query.equal("status", "scheduled"), Query.orderAsc("scheduledAt")] }),
}

export const sessionRsvpsDb = {
  list: (params?: ListParams) => listDocuments(collections.sessionRsvps, params),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.sessionRsvps, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.sessionRsvps, id, data),
}

// ─── Community — Comments ─────────────────────────

export const courseCommentsDb = {
  list: (params?: ListParams) => listDocuments(collections.courseComments, params),
  get: (id: string) => getDocument(collections.courseComments, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.courseComments, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.courseComments, id, data),
  delete: (id: string) => deleteDocument(collections.courseComments, id),
  listByLesson: (lessonId: string) =>
    listDocuments(collections.courseComments, { queries: [Query.equal("lessonId", lessonId), Query.orderDesc("$createdAt")] }),
}

export const courseReviewsDb = {
  list: (params?: ListParams) => listDocuments(collections.courseReviews, params),
  get: (id: string) => getDocument(collections.courseReviews, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.courseReviews, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.courseReviews, id, data),
  delete: (id: string) => deleteDocument(collections.courseReviews, id),
  listByCourse: (courseId: string) =>
    listDocuments(collections.courseReviews, { queries: [Query.equal("courseId", courseId), Query.orderDesc("$createdAt")] }),
}

// ─── Community — Forums ───────────────────────────

export const forumCategoriesDb = {
  list: (params?: ListParams) => listDocuments(collections.forumCategories, params),
  get: (id: string) => getDocument(collections.forumCategories, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.forumCategories, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.forumCategories, id, data, true),
}

export const forumThreadsDb = {
  list: (params?: ListParams) => listDocuments(collections.forumThreads, params),
  get: (id: string) => getDocument(collections.forumThreads, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.forumThreads, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.forumThreads, id, data),
  delete: (id: string) => deleteDocument(collections.forumThreads, id),
  listByCategory: (categoryId: string) =>
    listDocuments(collections.forumThreads, { queries: [Query.equal("categoryId", categoryId), Query.orderDesc("$createdAt")] }),
}

export const forumRepliesDb = {
  list: (params?: ListParams) => listDocuments(collections.forumReplies, params),
  get: (id: string) => getDocument(collections.forumReplies, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.forumReplies, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.forumReplies, id, data),
  delete: (id: string) => deleteDocument(collections.forumReplies, id),
  listByThread: (threadId: string) =>
    listDocuments(collections.forumReplies, { queries: [Query.equal("threadId", threadId), Query.orderAsc("$createdAt")] }),
}

// ─── Payments ─────────────────────────────────────

export const paymentsDb = {
  list: (params?: ListParams) => listDocuments(collections.payments, params, true),
  get: (id: string) => getDocument(collections.payments, id, true),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.payments, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.payments, id, data, true),
  listByUser: (userId: string) =>
    listDocuments(collections.payments, { queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")], useAdmin: true }),
}

export const subscriptionsDb = {
  list: (params?: ListParams) => listDocuments(collections.subscriptions, params, true),
  get: (id: string) => getDocument(collections.subscriptions, id, true),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.subscriptions, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.subscriptions, id, data, true),
}

// ─── Moderation & Audit ───────────────────────────

export const moderationActionsDb = {
  list: (params?: ListParams) => listDocuments(collections.moderationActions, { ...params, useAdmin: true }),
  get: (id: string) => getDocument(collections.moderationActions, id, true),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.moderationActions, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.moderationActions, id, data, true),
  listByTarget: (targetUserId: string) =>
    listDocuments(collections.moderationActions, { queries: [Query.equal("targetUserId", targetUserId), Query.orderDesc("$createdAt")], useAdmin: true }),
}

export const auditLogsDb = {
  list: (params?: ListParams) => listDocuments(collections.auditLogs, { ...params, useAdmin: true }),
  get: (id: string) => getDocument(collections.auditLogs, id, true),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.auditLogs, id, data, true),
}

export const notificationsDb = {
  list: (params?: ListParams) => listDocuments(collections.notifications, params),
  get: (id: string) => getDocument(collections.notifications, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.notifications, id, data, true),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.notifications, id, data),
  listByUser: (userId: string) =>
    listDocuments(collections.notifications, { queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")] }),
  markRead: (id: string) => updateDocument(collections.notifications, id, { isRead: true, readAt: new Date().toISOString() }),
}
