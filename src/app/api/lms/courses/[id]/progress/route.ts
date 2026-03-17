/**
 * @fileoverview GET /api/lms/courses/[id]/progress — get completed lessons for a course.
 * POST /api/lms/courses/[id]/progress — mark a lesson as complete.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { z } from "zod"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { enrollmentsDb, lessonsDb, progressDb } from "@/lib/appwrite/database"
import { enforceRateLimit } from "@/lib/ratelimit-helper"

// Zod schema for progress POST request
const markProgressSchema = z.object({
  lessonId: z
    .string()
    .min(1, "lessonId is required")
    .max(128, "lessonId must be at most 128 characters"),
  isCompleted: z.boolean().optional().default(true),
})

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
  // Rate limiting
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: courseId } = await params
    const body = await req.json()

    // Validate input with Zod
    const result = markProgressSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { lessonId, isCompleted } = result.data

    // Verify lesson belongs to course
    const lesson = await lessonsDb.get(lessonId)
    if ((lesson as any).courseId !== courseId) {
      return NextResponse.json(
        { error: "lessonId does not belong to this course" },
        { status: 400 }
      )
    }

    // Verify enrollment
    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    // Check if progress already exists
    const existing = await progressDb.getByUserCourseLesson(user.$id, courseId, lessonId)

    if (!existing) {
      await progressDb.create(ID.unique(), {
        userId: user.$id,
        courseId,
        lessonId,
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
      })
    } else if ((existing as any).isCompleted !== isCompleted) {
      // Update the record when completion status actually changes
      await progressDb.update((existing as any).$id, {
        isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
      })
    }

    return NextResponse.json({ success: true, lessonId, completed: isCompleted })
  } catch (error) {
    console.error("[API] POST /api/lms/courses/[id]/progress", error)
    return NextResponse.json({ error: "Failed to mark progress" }, { status: 500 })
  }
}
