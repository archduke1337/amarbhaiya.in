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

    const testimonials = await Promise.all(
      reviews.documents.map(async (review) => {
        let name = "Anonymous Student"
        try {
          // Fetch user details for the review if possible
          if (review.userId) {
            const user = await usersDb.get(review.userId)
            name = user.name || name
          }
        } catch (e) {
          // Ignore failures for individual user fetches
        }
        return {
          name,
          role: "Student",
          text: review.content || review.comment || "Great course!",
        }
      })
    )

    const response = NextResponse.json({ testimonials })
    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/public/testimonials", error)
    return NextResponse.json({ testimonials: [] })
  }
}
