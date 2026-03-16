/**
 * @fileoverview GET /api/lms/lessons/[id]/comments — list lesson comments.
 * POST /api/lms/lessons/[id]/comments — post a lesson comment.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { courseCommentsDb, enrollmentsDb, lessonsDb } from "@/lib/appwrite/database"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params
    const result = await courseCommentsDb.listByLesson(lessonId)
    return NextResponse.json({ comments: result.documents })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: lessonId } = await params
    const { content } = await req.json()

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const lesson = await lessonsDb.get(lessonId)
    const courseId = (lesson as any).courseId as string | undefined

    if (!courseId) {
      return NextResponse.json({ error: "Lesson is not linked to a course" }, { status: 400 })
    }

    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    const comment = await courseCommentsDb.create(ID.unique(), {
      lessonId,
      userId: user.$id,
      authorName: user.name,
      content: content.trim(),
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 })
  }
}
