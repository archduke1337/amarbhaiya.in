/**
 * @fileoverview Appwrite Function: Payment Webhook Handler.
 * Processes external payment gateway webhooks and updates payment documents.
 */
import { Client, Databases, Query, ID } from "node-appwrite"

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!) // Use dynamic API endpoint
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers['x-appwrite-key']!) // Use dynamic runtime API key

  const databases = new Databases(client)
  const databaseId = process.env.APPWRITE_DATABASE_ID!
  const paymentsCol = process.env.APPWRITE_COLLECTION_PAYMENTS!
  const enrollmentsCol = process.env.APPWRITE_COLLECTION_ENROLLMENTS!

  try {
    // Verify the request comes from a trusted internal caller via shared secret
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET
    const callerSecret = req.headers['x-webhook-secret']
    if (!webhookSecret || callerSecret !== webhookSecret) {
      error("Unauthorized: invalid or missing webhook secret")
      return res.json({ error: "Unauthorized" }, 401)
    }

    const payload = req.bodyJson
    const { paymentId, status, gateway, transactionId } = payload

    if (!paymentId || !status) {
      return res.json({ error: "Missing paymentId or status" }, 400)
    }

    log(`Payment webhook: ${paymentId} → ${status} via ${gateway ?? "unknown"}`)

    // Update payment record
    const updateData: Record<string, unknown> = {
      status,
      ...(transactionId && { gatewayPaymentId: transactionId }),
      ...(status === "completed" && { paidAt: new Date().toISOString() }),
    }

    await databases.updateDocument(databaseId, paymentsCol, paymentId, updateData)
    log(`Payment ${paymentId} updated to ${status}`)

    // If payment succeeded, create enrollment
    if (status === "completed") {
      const paymentDoc = await databases.getDocument(databaseId, paymentsCol, paymentId)
      const userId = paymentDoc.userId as string
      const courseId = paymentDoc.courseId as string

      if (userId && courseId) {
        // Check for existing enrollment
        const existing = await databases.listDocuments(databaseId, enrollmentsCol, [
          Query.equal("userId", userId),
          Query.equal("courseId", courseId),
          Query.limit(1),
        ])

        if (existing.total === 0) {
          await databases.createDocument(databaseId, enrollmentsCol, ID.unique(), {
            userId,
            courseId,
            paymentId,
            status: "active",
            enrolledAt: new Date().toISOString(),
          })
          log(`Enrollment created for user ${userId} in course ${courseId}`)
        } else {
          log(`User ${userId} already enrolled in course ${courseId}`)
        }
      }
    }

    return res.json({ success: true, paymentId, status })
  } catch (err: any) {
    error(`Payment webhook failed: ${err.message}`)
    return res.json({ success: false, error: err.message }, 500)
  }
}
