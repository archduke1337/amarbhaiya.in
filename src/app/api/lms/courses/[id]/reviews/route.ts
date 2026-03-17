/**
 * @fileoverview GET/POST /api/lms/courses/[id]/reviews — handle student star ratings and feedback.
 * Includes Zod input validation and HTML sanitization for comments.
 */
import { NextResponse, NextRequest } from "next/server"
import { z } from "zod"
import { courseReviewsDb, enrollmentsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { ID } from "node-appwrite"
import { sanitizeHtml } from "@/lib/sanitize"

// ─── Validation Schemas ──────────────────────────────────────────────────────

const submitReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .max(5000, "Comment cannot exceed 5000 characters")
    .optional()
    .default(""),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params
    const reviews = await courseReviewsDb.listByCourse(courseId)
    
    return NextResponse.json({ 
      reviews: reviews.documents.map((r: any) => ({
        id: r.$id,
        userId: r.userId,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.$createdAt
      }))
    })
  } catch (error) {
    console.error("[API] GET /api/lms/courses/[id]/reviews", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: courseId } = await params
    const body = await req.json()

    // Validate input
    const validation = submitReviewSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      )
    }

    const { rating, comment } = validation.data
    const sanitizedComment = comment ? sanitizeHtml(comment) : ""

    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: "Only enrolled students can review this course" }, { status: 403 })
    }

    const existing = await courseReviewsDb.getByUserAndCourse(user.$id, courseId)

    if (existing) {
      const updated = await courseReviewsDb.update((existing as any).$id, {
        rating,
        comment: sanitizedComment,
        userName: user.name,
        status: "approved",
      })
      return NextResponse.json(updated)
    }

    const review = await courseReviewsDb.create(ID.unique(), {
      userId: user.$id,
      userName: user.name,
      courseId,
      rating,
      comment: sanitizedComment,
      status: "approved"
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("[API] POST /api/lms/courses/[id]/reviews", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
