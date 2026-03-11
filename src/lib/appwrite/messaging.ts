/**
 * @fileoverview Appwrite Messaging helpers — enrollment confirmation, certificate email.
 * Uses Appwrite's built-in messaging service.
 */
import { createAdminClient } from "./server"
import { ID } from "node-appwrite"

/** Send enrollment confirmation email */
export async function sendEnrollmentConfirmation(userId: string, courseName: string) {
  // TODO: Implement with Appwrite Messaging when configured
  console.log(`[Messaging] Enrollment confirmation for user ${userId} — course: ${courseName}`)
}

/** Send certificate email with download link */
export async function sendCertificateEmail(userId: string, courseName: string, certificateUrl: string) {
  // TODO: Implement with Appwrite Messaging when configured
  console.log(`[Messaging] Certificate email for user ${userId} — course: ${courseName}`)
}

/** Send notification to user */
export async function sendNotification(userId: string, title: string, message: string) {
  // TODO: Implement with Appwrite Messaging when configured
  console.log(`[Messaging] Notification for user ${userId}: ${title}`)
}
