/**
 * @fileoverview Appwrite function: Create Enrollment.
 * Triggered when a payment status changes to "completed".
 */
import { Client, Databases, Query, ID } from "node-appwrite"

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!) // Use dynamic API endpoint
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers['x-appwrite-key']!) // Use dynamic runtime API key

  const databases = new Databases(client)
  const DB = process.env.APPWRITE_DATABASE_ID!
  const enrollmentsCol = process.env.APPWRITE_COLLECTION_ENROLLMENTS!
  const notificationsCol = process.env.APPWRITE_COLLECTION_NOTIFICATIONS!
  const owner = (process.env.WEBHOOK_ENROLLMENT_OWNER ?? "next").toLowerCase()

  try {
    if (owner !== "appwrite-function") {
      return res.json({ skipped: true, reason: "Enrollment owner is Next.js webhook" })
    }

    // req.bodyJson is the modern way to access parsed payload
    const payment = req.bodyJson
    log(`Processing enrollment for payment: ${payment.$id}`)

    if (payment.status !== "completed") {
      return res.json({ skipped: true, reason: "Payment not completed" })
    }

    // Check if enrollment already exists
    const existing = await databases.listDocuments(DB, enrollmentsCol, [
      Query.equal("userId", payment.userId),
      Query.equal("courseId", payment.courseId),
    ])

    if (existing.total > 0) {
      return res.json({ skipped: true, reason: "Enrollment exists" })
    }

    // Create enrollment
    await databases.createDocument(DB, enrollmentsCol, ID.unique(), {
      userId: payment.userId,
      courseId: payment.courseId,
      paymentId: payment.$id,
      status: "active",
      enrolledAt: new Date().toISOString(),
    })

    // Send notification to user
    try {
      await databases.createDocument(DB, notificationsCol, ID.unique(), {
        userId: payment.userId,
        type: "enrollment",
        title: "Enrollment Confirmed!",
        message: `You have been successfully enrolled. Start learning now!`,
        linkUrl: `/app/courses/${payment.courseId}`,
        isRead: false,
      })
    } catch (notifErr) {
      log(`Non-critical: notification creation failed: ${notifErr}`)
    }

    log(`Enrollment created for user ${payment.userId} in course ${payment.courseId}`)
    return res.json({ success: true })
  } catch (err: any) {
    error(`Create enrollment failed: ${err.message}`)
    return res.json({ success: false, error: err.message }, 500)
  }
}
