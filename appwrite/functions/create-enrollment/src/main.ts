/**
 * @fileoverview Appwrite function: Create Enrollment.
 * Triggered when a payment status changes to "completed".
 * Creates enrollment record and sends confirmation notification.
 */
import { Client, Databases, Query } from "node-appwrite"

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!)

  const databases = new Databases(client)
  const DB = process.env.APPWRITE_DATABASE_ID!

  try {
    const payment = JSON.parse(req.body)
    log(`Processing enrollment for payment: ${payment.$id}`)

    if (payment.status !== "completed") {
      return res.json({ skipped: true, reason: "Payment not completed" })
    }

    // Check if enrollment already exists
    const existing = await databases.listDocuments(DB, process.env.COLLECTION_ENROLLMENTS!, [
      Query.equal("userId", payment.userId),
      Query.equal("courseId", payment.courseId),
    ])

    if (existing.total > 0) {
      return res.json({ skipped: true, reason: "Enrollment exists" })
    }

    // Create enrollment
    await databases.createDocument(DB, process.env.COLLECTION_ENROLLMENTS!, "unique()", {
      userId: payment.userId,
      courseId: payment.courseId,
      paymentId: payment.$id,
      status: "active",
      enrolledAt: new Date().toISOString(),
    })

    log(`Enrollment created for user ${payment.userId} in course ${payment.courseId}`)
    return res.json({ success: true })
  } catch (err) {
    error(`Create enrollment failed: ${err}`)
    return res.json({ success: false }, 500)
  }
}
