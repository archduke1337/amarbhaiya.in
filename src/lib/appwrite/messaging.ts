/**
 * @fileoverview Appwrite Messaging helpers — enrollment confirmation, certificate email, notifications.
 * Uses Appwrite Databases to create in-app notifications.
 * Email sending is handled client-side via EmailJS or server-side via Appwrite Messaging when configured.
 */
import { ID } from "node-appwrite"
import { createAdminClient } from "./server"
import { APPWRITE_CONFIG } from "@/config/appwrite"

const { databaseId, collections } = APPWRITE_CONFIG

/** Send enrollment confirmation notification */
export async function sendEnrollmentConfirmation(userId: string, courseName: string) {
  try {
    const { databases } = await createAdminClient()
    await databases.createDocument(databaseId, collections.notifications, ID.unique(), {
      userId,
      type: "enrollment",
      title: "Enrollment Confirmed!",
      message: `You've been successfully enrolled in "${courseName}". Start learning now!`,
      linkUrl: "/app/dashboard",
      isRead: false,
    })
  } catch (err) {
    console.error(`[Messaging] Failed to send enrollment confirmation:`, err)
  }
}

/** Send certificate notification with download link */
export async function sendCertificateEmail(userId: string, courseName: string, certificateUrl: string) {
  try {
    const { databases } = await createAdminClient()
    await databases.createDocument(databaseId, collections.notifications, ID.unique(), {
      userId,
      type: "certificate",
      title: "🎉 Certificate Earned!",
      message: `Congratulations! You've completed "${courseName}" and earned your certificate.`,
      linkUrl: "/app/certificates",
      isRead: false,
    })
  } catch (err) {
    console.error(`[Messaging] Failed to send certificate notification:`, err)
  }
}

/** Send generic notification to user */
export async function sendNotification(userId: string, title: string, message: string, linkUrl?: string) {
  try {
    const { databases } = await createAdminClient()
    await databases.createDocument(databaseId, collections.notifications, ID.unique(), {
      userId,
      type: "general",
      title,
      message,
      linkUrl: linkUrl ?? null,
      isRead: false,
    })
  } catch (err) {
    console.error(`[Messaging] Failed to send notification:`, err)
  }
}
