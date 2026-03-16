/**
 * @fileoverview POST /api/instructor/lessons — create a new lesson.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { lessonsDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import { verifyCourseOwnership } from "@/lib/services/instructor"

export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, moduleId, title, type, order } = await req.json()

    if (!courseId || !moduleId || !title) {
      return NextResponse.json({ error: "courseId, moduleId, and title are required" }, { status: 400 })
    }

    // Verify the instructor owns this course
    const ownership = await verifyCourseOwnership(user, courseId)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    const lesson = await lessonsDb.create(ID.unique(), {
      courseId,
      moduleId,
      title,
      type: type || "video",
      order: order || 0,
      isPublished: false,
      isFree: false,
    })

    return NextResponse.json({ success: true, lesson })
  } catch (error) {
    console.error("[API] POST /api/instructor/lessons", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
