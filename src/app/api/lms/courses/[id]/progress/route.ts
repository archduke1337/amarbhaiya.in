/**
 * @fileoverview GET /api/lms/courses/[id]/progress — get completed lessons for a course.
 * POST /api/lms/courses/[id]/progress — mark a lesson as complete.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { enrollmentsDb, progressDb } from "@/lib/appwrite/database"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ completed: [] })
    }

    const { id: courseId } = await params
    const result = await progressDb.listByUserAndCourse(user.$id, courseId)

    const completedLessonIds = result.documents.map((doc: any) => doc.lessonId)

    return NextResponse.json({ completed: completedLessonIds })
  } catch (error) {
    console.error("[API] GET /api/lms/courses/[id]/progress", error)
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
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
    const { lessonId } = body

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId required" }, { status: 400 })
    }

    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    const existing = await progressDb.getByUserCourseLesson(user.$id, courseId, lessonId)

    if (!existing) {
      await progressDb.create(ID.unique(), {
        userId: user.$id,
        courseId,
        lessonId,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true, lessonId })
  } catch (error) {
    console.error("[API] POST /api/lms/courses/[id]/progress", error)
    return NextResponse.json({ error: "Failed to mark progress" }, { status: 500 })
  }
}
