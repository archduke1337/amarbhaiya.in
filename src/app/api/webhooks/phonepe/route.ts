/**
 * @fileoverview PhonePe payment webhook/callback handler.
 * Verifies callback checksum and updates payment + enrollment records.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { verifyPhonePeCallback } from "@/lib/payments/phonepe"
import { paymentsDb } from "@/lib/appwrite/database"
import { createEnrollment } from "@/lib/services/enrollment"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const xVerifyHeader = req.headers.get("x-verify")

    if (!xVerifyHeader) {
      return NextResponse.json({ error: "Missing X-VERIFY header" }, { status: 400 })
    }

    const isValid = verifyPhonePeCallback(rawBody, xVerifyHeader)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    const { merchantTransactionId, transactionId, code } = body

    if (code === "PAYMENT_SUCCESS") {
      // Update payment record
      await paymentsDb.update(merchantTransactionId, {
        phonePeTransactionId: transactionId,
        status: "completed",
        method: "phonepe",
      })

      // Create enrollment
      const paymentDoc = await paymentsDb.get(merchantTransactionId)
      if (paymentDoc?.userId && paymentDoc?.courseId) {
        await createEnrollment({
          userId: paymentDoc.userId as string,
          courseId: paymentDoc.courseId as string,
          paymentId: merchantTransactionId,
        })
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
