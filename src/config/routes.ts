/**
 * @fileoverview All route constants as typed functions. Never hardcode routes elsewhere.
 */

export const ROUTES = {
  // ─── Public ──────────────────────────────────
  HOME: "/",
  ABOUT: "/about",
  COURSES: "/courses",
  COURSE_DETAIL: (slug: string) => `/courses/${slug}` as const,
  BLOG: "/blog",
  BLOG_POST: (slug: string) => `/blog/${slug}` as const,
  CONTACT: "/contact",

  // ─── Auth ────────────────────────────────────
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",

  // ─── Student (App) ──────────────────────────
  APP_DASHBOARD: "/app/dashboard",
  APP_COURSES: "/app/courses",
  APP_COURSE: (id: string) => `/app/courses/${id}` as const,
  APP_LESSON: (courseId: string, lessonId: string) => `/app/courses/${courseId}/${lessonId}` as const,
  APP_COMMUNITY: "/app/community",
  APP_FORUM_CATEGORY: (categoryId: string) => `/app/community/${categoryId}` as const,
  APP_FORUM_THREAD: (categoryId: string, threadId: string) => `/app/community/${categoryId}/${threadId}` as const,
  APP_LIVE: (sessionId: string) => `/app/live/${sessionId}` as const,
  APP_CERTIFICATES: "/app/certificates",
  APP_PROFILE: (id: string) => `/app/profile/${id}` as const,

  // ─── Instructor ──────────────────────────────
  INSTRUCTOR_DASHBOARD: "/instructor",
  INSTRUCTOR_COURSES: "/instructor/courses",
  INSTRUCTOR_COURSE_NEW: "/instructor/courses/new",
  INSTRUCTOR_COURSE: (id: string) => `/instructor/courses/${id}` as const,
  INSTRUCTOR_CURRICULUM: (id: string) => `/instructor/courses/${id}/curriculum` as const,
  INSTRUCTOR_STUDENTS: (id: string) => `/instructor/courses/${id}/students` as const,
  INSTRUCTOR_COURSE_SETTINGS: (id: string) => `/instructor/courses/${id}/settings` as const,
  INSTRUCTOR_LIVE: "/instructor/live",
  INSTRUCTOR_LIVE_NEW: "/instructor/live/new",
  INSTRUCTOR_COMMUNITY: "/instructor/community",

  // ─── Moderator ───────────────────────────────
  MODERATOR_DASHBOARD: "/moderator",
  MODERATOR_REPORTS: "/moderator/reports",
  MODERATOR_STUDENTS: "/moderator/students",
  MODERATOR_STUDENT: (id: string) => `/moderator/students/${id}` as const,
  MODERATOR_COMMUNITY: "/moderator/community",
  MODERATOR_LIVE: "/moderator/live",

  // ─── Admin ───────────────────────────────────
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_USER: (id: string) => `/admin/users/${id}` as const,
  ADMIN_COURSES: "/admin/courses",
  ADMIN_COURSE: (id: string) => `/admin/courses/${id}` as const,
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_PAYMENT: (id: string) => `/admin/payments/${id}` as const,
  ADMIN_LIVE: "/admin/live",
  ADMIN_COMMUNITY: "/admin/community",
  ADMIN_MODERATION: "/admin/moderation",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",
  ADMIN_SETTINGS: "/admin/settings",

  // ─── API ─────────────────────────────────────
  API_WEBHOOK_RAZORPAY: "/api/webhooks/razorpay",
  API_WEBHOOK_PHONEPE: "/api/webhooks/phonepe",
  API_STREAM_TOKEN: "/api/stream/token",
} as const
