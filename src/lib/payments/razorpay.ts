/**
 * @fileoverview Razorpay integration — createOrder, verifyWebhook signature.
 */
import Razorpay from "razorpay"
import { createHmac } from "crypto"

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured")
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export type CreateOrderParams = {
  amount: number // in paise (₹100 = 10000)
  currency?: string
  receipt?: string
  notes?: Record<string, string>
}

/** Create a Razorpay order */
export async function createRazorpayOrder(params: CreateOrderParams) {
  const razorpay = getRazorpayClient()

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
