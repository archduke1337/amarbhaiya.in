/**
 * @fileoverview PhonePe Business payment integration — initiate payment, verify callback.
 */
import { createHash } from "crypto"

const PHONEPE_ENV = process.env.PHONEPE_ENV ?? "UAT"
const BASE_URL =
  PHONEPE_ENV === "PRODUCTION"
    ? "https://api.phonepe.com/apis/hermes"
    : "https://api-preprod.phonepe.com/apis/pg-sandbox"

export type PhonePePaymentParams = {
  merchantTransactionId: string
  amount: number // in paise
  userId: string
  redirectUrl: string
  callbackUrl: string
}

/** Initiate a PhonePe payment */
export async function initiatePhonePePayment(params: PhonePePaymentParams) {
  const merchantId = process.env.PHONEPE_MERCHANT_ID
  const saltKey = process.env.PHONEPE_SALT_KEY
  const saltIndex = process.env.PHONEPE_SALT_INDEX ?? "1"

  if (!merchantId || !saltKey) {
    throw new Error("PhonePe credentials not configured")
  }

  const payload = {
    merchantId,
    merchantTransactionId: params.merchantTransactionId,
    merchantUserId: params.userId,
    amount: params.amount,
    redirectUrl: params.redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: params.callbackUrl,
    paymentInstrument: { type: "PAY_PAGE" },
  }

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64")
  // PhonePe requires plain SHA256 (not HMAC) of concatenated string
  const checksum = createHash("sha256")
    .update(`${base64Payload}/pg/v1/pay${saltKey}`)
    .digest("hex")

  const xVerify = `${checksum}###${saltIndex}`

  const response = await fetch(`${BASE_URL}/pg/v1/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
    },
    body: JSON.stringify({ request: base64Payload }),
  })

  return response.json()
}

/** Verify PhonePe callback checksum */
export function verifyPhonePeCallback(responseBody: string, xVerifyHeader: string): boolean {
  const saltKey = process.env.PHONEPE_SALT_KEY
  const saltIndex = process.env.PHONEPE_SALT_INDEX ?? "1"

  if (!saltKey) return false

  // PhonePe requires plain SHA256 (not HMAC) of concatenated string
  const checksum = createHash("sha256")
    .update(`${responseBody}${saltKey}`)
    .digest("hex")

  return xVerifyHeader === `${checksum}###${saltIndex}`
}
