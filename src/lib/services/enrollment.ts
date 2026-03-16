/**
 * @fileoverview Enrollment Service — Centralized logic for creating enrollments.
 * Ensures data consistency across free enrollments, payment webhooks, and manual actions.
 */
import { ID } from "node-appwrite"
import { enrollmentsDb, notificationsDb } from "@/lib/appwrite/database"

export type EnrollmentData = {
  userId: string
  courseId: string
  paymentId?: string
  status?: "active" | "pending" | "completed"
}

/**
 * Creates a new enrollment record and sends an in-app notification.
 * Handles deduplication check internally.
 */
export async function createEnrollment({
  userId,
  courseId,
  paymentId,
  status = "active",
}: EnrollmentData) {
  // 1. Check for existing enrollment
  const existing = await enrollmentsDb.getByUserAndCourse(userId, courseId)
  if (existing) {
    return { enrollment: existing, message: "Already enrolled", created: false }
  }

  // 2. Create the enrollment document
  const enrollment = await enrollmentsDb.create(ID.unique(), {
    userId,
    courseId,
    paymentId: paymentId || null,
    status,
    enrolledAt: new Date().toISOString(),
  })

  // 3. Send a notification to the user
  try {
    await notificationsDb.create(ID.unique(), {
      userId,
      type: "enrollment",
      title: "Enrollment Confirmed!",
      message: `You've successfully enrolled! Ready to start learning?`,
      linkUrl: `/app/courses/${courseId}`,
      isRead: false,
    })
  } catch (err) {
    console.error("Non-critical: Failed to send enrollment notification", err)
  }

  return { enrollment, created: true }
}
