/**
 * @fileoverview Razorpay payment webhook handler.
 * Verifies webhook signature and updates payment + enrollment records.
 */

import { NextRequest, NextResponse } from "next/server"
import { verifyRazorpayWebhook } from "@/lib/payments/razorpay"
import { paymentsDb } from "@/lib/appwrite/database"
import { createEnrollment } from "@/lib/services/enrollment"

const ENROLLMENT_OWNER = (process.env.WEBHOOK_ENROLLMENT_OWNER ?? "next").toLowerCase()
const APP_SECRET = process.env.RAZORPAY_WEBHOOK_APP_SECRET
const REQUIRE_APP_SECRET = process.env.NODE_ENV === "production" && ENROLLMENT_OWNER === "next"

export async function POST(req: NextRequest) {
  try {
    if (REQUIRE_APP_SECRET && !APP_SECRET) {
      console.error("[Razorpay Webhook] Missing RAZORPAY_WEBHOOK_APP_SECRET in production")
      return NextResponse.json({ error: "Webhook misconfigured" }, { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")
    const appToken = req.headers.get("x-app-webhook-token")

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    if ((APP_SECRET || REQUIRE_APP_SECRET) && appToken !== APP_SECRET) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const isValid = verifyRazorpayWebhook(body, signature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity
      const { id: paymentId, method } = payment
      const notes = payment.notes || {}

      // Update payment record
      await paymentsDb.update(notes.paymentDocId, {
        razorpayPaymentId: paymentId,
        status: "completed",
        method,
      })

      // Create enrollment
      if (ENROLLMENT_OWNER === "next" && notes.userId && notes.courseId) {
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
