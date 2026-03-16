/**
 * @fileoverview GET/POST /api/lms/courses/[id]/reviews — handle student star ratings and feedback.
 */
import { NextResponse, NextRequest } from "next/server"
import { courseReviewsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { ID } from "node-appwrite"

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
    const { rating, comment } = await req.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid rating (1-5) is required" }, { status: 400 })
    }

    const review = await courseReviewsDb.create(ID.unique(), {
      userId: user.$id,
      userName: user.name,
      courseId,
      rating: parseInt(rating),
      comment: comment || "",
      status: "approved"
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("[API] POST /api/lms/courses/[id]/reviews", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
