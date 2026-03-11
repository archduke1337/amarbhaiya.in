/**
 * @fileoverview Payment types — Razorpay, PhonePe, transaction records.
 */
import type { BaseDocument } from "./appwrite"

export type PaymentMethod = "razorpay" | "phonepe"
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

export interface Payment extends BaseDocument {
  userId: string
  courseId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  gatewayOrderId?: string
  gatewayPaymentId?: string
  gatewaySignature?: string
  receiptId?: string
  couponCode?: string
  discountAmount: number
  notes?: string
  paidAt?: string
  refundedAt?: string
}

export interface Subscription extends BaseDocument {
  userId: string
  planId: string
  status: "active" | "cancelled" | "expired"
  startDate: string
  endDate: string
  paymentId: string
}
