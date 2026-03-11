/**
 * @fileoverview Course, Module, Lesson, Enrollment, Progress types.
 */
import type { BaseDocument } from "./appwrite"

export interface Course extends BaseDocument {
  title: string
  slug: string
  tagline?: string
  description?: string
  thumbnailFileId?: string
  instructorId: string
  categoryId: string
  level: "beginner" | "intermediate" | "advanced"
  status: "draft" | "published" | "archived"
  price: number
  discountPrice?: number
  currency: string
  duration?: string
  totalLessons: number
  totalModules: number
  enrollmentCount: number
  tags: string[]
  isFeatured: boolean
}

export interface CourseModule extends BaseDocument {
  courseId: string
  title: string
  description?: string
  order: number
  isPublished: boolean
}

export interface Lesson extends BaseDocument {
  courseId: string
  moduleId: string
  title: string
  summary?: string
  content?: string
  videoFileId?: string
  duration?: string
  order: number
  isFree: boolean
  isPublished: boolean
}

export interface Resource extends BaseDocument {
  lessonId: string
  title: string
  fileId: string
  fileType: string
  fileSize: number
}

export interface Enrollment extends BaseDocument {
  userId: string
  courseId: string
  paymentId?: string
  enrolledAt: string
  status: "active" | "completed" | "cancelled" | "expired"
  completedAt?: string
}

export interface Progress extends BaseDocument {
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  completedAt?: string
  watchTimeSeconds: number
}

export interface Category extends BaseDocument {
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
}

export interface Quiz extends BaseDocument {
  courseId: string
  lessonId?: string
  title: string
  description?: string
  passingScore: number
  timeLimit?: number
  isPublished: boolean
}

export interface QuizQuestion extends BaseDocument {
  quizId: string
  type: "mcq" | "true_false" | "short_answer"
  question: string
  options?: string[]
  correctAnswer: string
  explanation?: string
  points: number
  order: number
}

export interface QuizAttempt extends BaseDocument {
  quizId: string
  userId: string
  answers: Record<string, string>
  score: number
  passed: boolean
  startedAt: string
  completedAt?: string
}

export interface Assignment extends BaseDocument {
  courseId: string
  lessonId?: string
  title: string
  description: string
  dueDate?: string
  maxScore: number
  isPublished: boolean
}

export interface Submission extends BaseDocument {
  assignmentId: string
  userId: string
  content: string
  fileId?: string
  score?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}

export interface Certificate extends BaseDocument {
  userId: string
  courseId: string
  certificateFileId: string
  issuedAt: string
  certificateNumber: string
}
