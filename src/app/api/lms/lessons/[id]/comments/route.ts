/**
 * @fileoverview GET /api/lms/lessons/[id]/comments — list lesson comments.
 * POST /api/lms/lessons/[id]/comments — post a lesson comment.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { z } from "zod"
import sanitizeHtml from "sanitize-html"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { courseCommentsDb, enrollmentsDb, lessonsDb } from "@/lib/appwrite/database"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

// Zod schema for comment validation
const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(5000, "Comment must be less than 5000 characters")
    .transform((val) => val.trim()),
})

// HTML sanitization options
const SANITIZE_OPTIONS = {
  allowedTags: ["b", "i", "em", "strong", "br", "p", "a"],
  allowedAttributes: {
    a: ["href", "title"],
  },
  disallowedTagsMode: "discard" as const,
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { id: lessonId } = await params
    const result = await courseCommentsDb.listByLesson(lessonId)
    
    const response = NextResponse.json({ comments: result.documents })
    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/lms/lessons/[id]/comments", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const user = await getLoggedInUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: lessonId } = await params
    const body = await req.json()

    // Validate input with Zod
    const result = createCommentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { content } = result.data

    // Verify lesson exists and get course ID
    const lesson = await lessonsDb.get(lessonId)
    const courseId = (lesson as any).courseId as string | undefined

    if (!courseId) {
      return NextResponse.json(
        { error: "Lesson is not linked to a course" },
        { status: 400 }
      )
    }

    // Verify enrollment
    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeHtml(content, SANITIZE_OPTIONS)

    const comment = await courseCommentsDb.create(ID.unique(), {
      lessonId,
      userId: user.$id,
      authorName: user.name,
      content: sanitizedContent,
    })

    const response = NextResponse.json({ success: true, comment })
    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] POST /api/lms/lessons/[id]/comments", error)
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}
