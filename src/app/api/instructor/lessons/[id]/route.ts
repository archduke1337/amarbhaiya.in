/**
 * @fileoverview PATCH /api/instructor/lessons/[id] — update lesson.
 * DELETE /api/instructor/lessons/[id] — delete lesson.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { lessonsDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import { verifyCourseOwnership } from "@/lib/services/instructor"

const ALLOWED_LESSON_FIELDS = [
  "title", "summary", "content", "videoFileId", "duration",
  "order", "isFree", "isPublished",
] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Fetch the lesson to get its courseId, then verify ownership
    const existingLesson = await lessonsDb.get(id)
    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    const ownership = await verifyCourseOwnership(user, existingLesson.courseId as string)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    // Whitelist allowed fields
    const body = await req.json()
    const updates: Record<string, unknown> = {}
    for (const field of ALLOWED_LESSON_FIELDS) {
      if (field in body) updates[field] = body[field]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const lesson = await lessonsDb.update(id, updates)
    return NextResponse.json({ success: true, lesson })
  } catch (error) {
    console.error("[API] PATCH /api/instructor/lessons/[id]", error)
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Fetch lesson to verify course ownership
    const existingLesson = await lessonsDb.get(id)
    if (!existingLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
    }

    const ownership = await verifyCourseOwnership(user, existingLesson.courseId as string)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    await lessonsDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /api/instructor/lessons/[id]", error)
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 })
  }
}
