/**
 * @fileoverview GET /api/lms/courses/[id] — get a single course with modules and lessons.
 */

import { NextRequest, NextResponse } from "next/server"
import { coursesDb, modulesDb, lessonsDb } from "@/lib/appwrite/database"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await coursesDb.get(id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Fetch modules and lessons
    const modulesResult = await modulesDb.listByCourse(id)
    const modules = await Promise.all(
      modulesResult.documents.map(async (mod) => {
        const lessonsResult = await lessonsDb.listByModule(mod.$id)
        return { ...mod, lessons: lessonsResult.documents }
      })
    )

    return NextResponse.json({ course: { ...course, modules } })
  } catch (error) {
    console.error("[API] GET /api/lms/courses/[id]", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}
