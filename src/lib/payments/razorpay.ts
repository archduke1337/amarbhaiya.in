/**
 * @fileoverview Razorpay integration — createOrder, verifyWebhook signature.
 */
import Razorpay from "razorpay"
import { createHmac } from "crypto"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
})

export type CreateOrderParams = {
  amount: number // in paise (₹100 = 10000)
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

/** Create a Razorpay order */
export async function createRazorpayOrder(params: CreateOrderParams) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured")
  }

  return razorpay.orders.create({
    amount: params.amount,
    currency: params.currency ?? "INR",
    receipt: params.receipt,
    notes: params.notes,
  })
}

/** Verify Razorpay payment signature */
export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const body = `${orderId}|${paymentId}`
  const expected = createHmac("sha256", secret).update(body).digest("hex")
  return expected === signature
}

/** Verify Razorpay webhook signature */
export function verifyRazorpayWebhook(body: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false

  const expected = createHmac("sha256", secret).update(body).digest("hex")
  return expected === signature
}
