/**
 * @fileoverview GET /api/public/testimonials — fetch real reviews/testimonials.
 */
import { NextRequest, NextResponse } from "next/server"
import { courseReviewsDb, usersDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

export async function GET(req: NextRequest) {
  // Rate limiting - public endpoint
  const rateLimitResponse = enforceRateLimit(req, "PUBLIC")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const reviews = await courseReviewsDb.list({
      queries: [Query.orderDesc("$createdAt"), Query.limit(3)],
    })

    // Batch fetch all users at once instead of per-review (prevent N+1)
    const userIds = [...new Set(reviews.documents.map((r: any) => r.userId).filter(Boolean))]
    const allUsers = await usersDb.list({ limit: 5000 })
    const userMap = new Map(allUsers.documents.map((u: any) => [u.$id, u]))

    const testimonials = reviews.documents.map((review: any) => {
      const user = userMap.get(review.userId)
      return {
        name: user?.name || "Anonymous Student",
        role: "Student",
        text: review.content || review.comment || "Great course!",
      }
    })

    const response = NextResponse.json({ testimonials })
    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/public/testimonials", error)
    return NextResponse.json({ testimonials: [] })
  }
}
