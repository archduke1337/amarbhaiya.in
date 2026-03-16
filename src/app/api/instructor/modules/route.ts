/**
 * @fileoverview POST /api/instructor/modules — create a new course module.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { modulesDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import { verifyCourseOwnership } from "@/lib/services/instructor"

export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId, title, order } = await req.json()

    if (!courseId || !title) {
      return NextResponse.json({ error: "courseId and title are required" }, { status: 400 })
    }

    // Verify the instructor owns this course
    const ownership = await verifyCourseOwnership(user, courseId)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    const module = await modulesDb.create(ID.unique(), {
      courseId,
      title,
      order: order || 0,
      isPublished: false,
    })

    return NextResponse.json({ success: true, module })
  } catch (error) {
    console.error("[API] POST /api/instructor/modules", error)
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 })
  }
}
