/**
 * @fileoverview Razorpay payment webhook handler.
 * Verifies webhook signature and updates payment + enrollment records.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { verifyRazorpayWebhook } from "@/lib/payments/razorpay"
import { paymentsDb } from "@/lib/appwrite/database"
import { createEnrollment } from "@/lib/services/enrollment"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    const isValid = verifyRazorpayWebhook(body, signature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity
      const { order_id, id: paymentId, amount, method } = payment
      const notes = payment.notes || {}

      // Update payment record
      await paymentsDb.update(notes.paymentDocId, {
        razorpayPaymentId: paymentId,
        status: "completed",
        method,
      })

      // Create enrollment
      if (notes.userId && notes.courseId) {
        await createEnrollment({
          userId: notes.userId,
          courseId: notes.courseId,
          paymentId: notes.paymentDocId,
        })
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity
      const notes = payment.notes || {}
      if (notes.paymentDocId) {
        await paymentsDb.update(notes.paymentDocId, { status: "failed" })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Razorpay Webhook]", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
