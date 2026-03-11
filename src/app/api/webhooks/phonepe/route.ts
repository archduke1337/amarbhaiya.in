/**
 * @fileoverview PhonePe payment webhook/callback handler.
 * Verifies callback checksum and updates payment + enrollment records.
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyPhonePeCallback } from "@/lib/payments/phonepe"
import { paymentsDb, enrollmentsDb } from "@/lib/appwrite/database"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { merchantTransactionId, transactionId, code } = body

    const isValid = await verifyPhonePeCallback(body)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 401 })
    }

    if (code === "PAYMENT_SUCCESS") {
      // Update payment record
      await paymentsDb.update(merchantTransactionId, {
        phonePeTransactionId: transactionId,
        status: "completed",
        method: "phonepe",
      })

      // Fetch payment to get userId and courseId
      const paymentDoc = await paymentsDb.get(merchantTransactionId)
      if (paymentDoc?.userId && paymentDoc?.courseId) {
        const existing = await enrollmentsDb.getByUserAndCourse(
          paymentDoc.userId,
          paymentDoc.courseId
        )
        if (!existing) {
          await enrollmentsDb.create({
            userId: paymentDoc.userId,
            courseId: paymentDoc.courseId,
            paymentId: merchantTransactionId,
            status: "active",
            enrolledAt: new Date().toISOString(),
          })
        }
      }
    } else {
      await paymentsDb.update(merchantTransactionId, { status: "failed" })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[PhonePe Webhook]", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
