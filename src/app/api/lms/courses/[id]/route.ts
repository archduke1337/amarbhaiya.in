/**
 * @fileoverview GET /api/lms/courses/[id] — get a single course with modules and lessons.
 */

import { NextRequest, NextResponse } from "next/server"
import { Query } from "node-appwrite"
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

    // Fetch modules and ALL lessons for this course in 2 queries (not N+2)
    const [modulesResult, allLessonsResult] = await Promise.all([
      modulesDb.listByCourse(id),
      lessonsDb.list({ queries: [Query.equal("courseId", id), Query.orderAsc("order")], limit: 500 }),
    ])

    // Group lessons by moduleId in JS
    const lessonsByModule = new Map<string, typeof allLessonsResult.documents>()
    for (const lesson of allLessonsResult.documents) {
      const mid = (lesson as any).moduleId as string
      if (!lessonsByModule.has(mid)) lessonsByModule.set(mid, [])
      lessonsByModule.get(mid)!.push(lesson)
    }

    const modules = modulesResult.documents.map((mod) => ({
      ...mod,
      lessons: lessonsByModule.get(mod.$id) ?? [],
    }))

    return NextResponse.json({ course: { ...course, modules } })
  } catch (error) {
    console.error("[API] GET /api/lms/courses/[id]", error)
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 })
  }
}
