/**
 * @fileoverview GET /api/public/testimonials — fetch real reviews/testimonials.
 */
import { NextResponse } from "next/server"
import { courseReviewsDb, usersDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"

export async function GET() {
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

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error("[API] GET /api/public/testimonials", error)
    return NextResponse.json({ testimonials: [] })
  }
}
