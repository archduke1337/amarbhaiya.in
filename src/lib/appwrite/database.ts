/**
 * @fileoverview Database query helpers for all 25 collections.
 * Centralizes all Appwrite Database queries. Use these instead of raw SDK calls.
 */
import { Query, type Models } from "node-appwrite"
import { createAdminClient, createSessionClient } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"

const { databaseId, collections } = APPWRITE_CONFIG

type ListParams = {
  queries?: string[]
  limit?: number
  offset?: number
}

// ─── Generic Helpers ──────────────────────────────

async function listDocuments(collectionId: string, params: ListParams = {}) {
  const { databases } = await createAdminClient()
  const queries = [...(params.queries ?? [])]
  if (params.limit) queries.push(Query.limit(params.limit))
  if (params.offset) queries.push(Query.offset(params.offset))
  return databases.listDocuments(databaseId, collectionId, queries)
}

async function getDocument(collectionId: string, documentId: string) {
  const { databases } = await createAdminClient()
  return databases.getDocument(databaseId, collectionId, documentId)
}

async function createDocument(collectionId: string, documentId: string, data: Record<string, unknown>) {
  const { databases } = await createAdminClient()
  return databases.createDocument(databaseId, collectionId, documentId, data)
}

async function updateDocument(collectionId: string, documentId: string, data: Record<string, unknown>) {
  const { databases } = await createAdminClient()
  return databases.updateDocument(databaseId, collectionId, documentId, data)
}

async function deleteDocument(collectionId: string, documentId: string) {
  const { databases } = await createAdminClient()
  return databases.deleteDocument(databaseId, collectionId, documentId)
}

// ─── Users ────────────────────────────────────────

export const usersDb = {
  list: (params?: ListParams) => listDocuments(collections.users, params),
  get: (id: string) => getDocument(collections.users, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.users, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.users, id, data),
}

// ─── Courses ──────────────────────────────────────

export const coursesDb = {
  list: (params?: ListParams) => listDocuments(collections.courses, params),
  get: (id: string) => getDocument(collections.courses, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.courses, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.courses, id, data),
  delete: (id: string) => deleteDocument(collections.courses, id),
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
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.categories, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.categories, id, data),
  delete: (id: string) => deleteDocument(collections.categories, id),
}

// ─── Modules ──────────────────────────────────────

export const modulesDb = {
  list: (params?: ListParams) => listDocuments(collections.modules, params),
  get: (id: string) => getDocument(collections.modules, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.modules, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.modules, id, data),
  delete: (id: string) => deleteDocument(collections.modules, id),
  listByCourse: (courseId: string) =>
    listDocuments(collections.modules, { queries: [Query.equal("courseId", courseId), Query.orderAsc("order")] }),
}

// ─── Lessons ──────────────────────────────────────

export const lessonsDb = {
  list: (params?: ListParams) => listDocuments(collections.lessons, params),
  get: (id: string) => getDocument(collections.lessons, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.lessons, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.lessons, id, data),
  delete: (id: string) => deleteDocument(collections.lessons, id),
  listByModule: (moduleId: string) =>
    listDocuments(collections.lessons, { queries: [Query.equal("moduleId", moduleId), Query.orderAsc("order")] }),
  listByCourse: (courseId: string) =>
    listDocuments(collections.lessons, { queries: [Query.equal("courseId", courseId), Query.orderAsc("order")] }),
}

// ─── Resources ────────────────────────────────────

export const resourcesDb = {
  list: (params?: ListParams) => listDocuments(collections.resources, params),
  get: (id: string) => getDocument(collections.resources, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.resources, id, data),
  delete: (id: string) => deleteDocument(collections.resources, id),
  listByLesson: (lessonId: string) =>
    listDocuments(collections.resources, { queries: [Query.equal("lessonId", lessonId)] }),
}

// ─── Enrollments ──────────────────────────────────

export const enrollmentsDb = {
  list: (params?: ListParams) => listDocuments(collections.enrollments, params),
  get: (id: string) => getDocument(collections.enrollments, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.enrollments, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.enrollments, id, data),
  getByUserAndCourse: async (userId: string, courseId: string) => {
    const result = await listDocuments(collections.enrollments, {
      queries: [Query.equal("userId", userId), Query.equal("courseId", courseId)],
      limit: 1,
    })
    return result.documents[0] ?? null
  },
  listByUser: (userId: string, params?: ListParams) =>
    listDocuments(collections.enrollments, { ...params, queries: [Query.equal("userId", userId), ...(params?.queries ?? [])] }),
  listByCourse: (courseId: string, params?: ListParams) =>
    listDocuments(collections.enrollments, { ...params, queries: [Query.equal("courseId", courseId), ...(params?.queries ?? [])] }),
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
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.quizzes, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.quizzes, id, data),
  delete: (id: string) => deleteDocument(collections.quizzes, id),
  listByCourse: (courseId: string) =>
    listDocuments(collections.quizzes, { queries: [Query.equal("courseId", courseId)] }),
}

export const quizQuestionsDb = {
  list: (params?: ListParams) => listDocuments(collections.quizQuestions, params),
  get: (id: string) => getDocument(collections.quizQuestions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.quizQuestions, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.quizQuestions, id, data),
  delete: (id: string) => deleteDocument(collections.quizQuestions, id),
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
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.assignments, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.assignments, id, data),
  delete: (id: string) => deleteDocument(collections.assignments, id),
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
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.certificates, id, data),
  listByUser: (userId: string) =>
    listDocuments(collections.certificates, { queries: [Query.equal("userId", userId)] }),
}

// ─── Live Sessions ────────────────────────────────

export const liveSessionsDb = {
  list: (params?: ListParams) => listDocuments(collections.liveSessions, params),
  get: (id: string) => getDocument(collections.liveSessions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.liveSessions, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.liveSessions, id, data),
  delete: (id: string) => deleteDocument(collections.liveSessions, id),
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

// ─── Community — Forums ───────────────────────────

export const forumCategoriesDb = {
  list: (params?: ListParams) => listDocuments(collections.forumCategories, params),
  get: (id: string) => getDocument(collections.forumCategories, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.forumCategories, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.forumCategories, id, data),
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
  list: (params?: ListParams) => listDocuments(collections.payments, params),
  get: (id: string) => getDocument(collections.payments, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.payments, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.payments, id, data),
  listByUser: (userId: string) =>
    listDocuments(collections.payments, { queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")] }),
}

export const subscriptionsDb = {
  list: (params?: ListParams) => listDocuments(collections.subscriptions, params),
  get: (id: string) => getDocument(collections.subscriptions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.subscriptions, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.subscriptions, id, data),
}

// ─── Moderation & Audit ───────────────────────────

export const moderationActionsDb = {
  list: (params?: ListParams) => listDocuments(collections.moderationActions, params),
  get: (id: string) => getDocument(collections.moderationActions, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.moderationActions, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.moderationActions, id, data),
  listByTarget: (targetUserId: string) =>
    listDocuments(collections.moderationActions, { queries: [Query.equal("targetUserId", targetUserId), Query.orderDesc("$createdAt")] }),
}

export const auditLogsDb = {
  list: (params?: ListParams) => listDocuments(collections.auditLogs, params),
  get: (id: string) => getDocument(collections.auditLogs, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.auditLogs, id, data),
}

export const notificationsDb = {
  list: (params?: ListParams) => listDocuments(collections.notifications, params),
  get: (id: string) => getDocument(collections.notifications, id),
  create: (id: string, data: Record<string, unknown>) => createDocument(collections.notifications, id, data),
  update: (id: string, data: Record<string, unknown>) => updateDocument(collections.notifications, id, data),
  listByUser: (userId: string) =>
    listDocuments(collections.notifications, { queries: [Query.equal("userId", userId), Query.orderDesc("$createdAt")] }),
  markRead: (id: string) => updateDocument(collections.notifications, id, { isRead: true, readAt: new Date().toISOString() }),
}
