/**
 * @fileoverview GET /api/instructor/courses/[id]/students — List all students enrolled in a course.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { enrollmentsDb, coursesDb, usersDb, lessonsDb, progressDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    const { id: courseId } = await params

    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify instructor owns the course
    const course = await coursesDb.get(courseId)
    if (course.instructorId !== user.$id && !user.labels.includes(ROLES.ADMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch enrollments (1 query)
    const enrollments = await enrollmentsDb.listByCourse(courseId)

    if (enrollments.documents.length === 0) {
      return NextResponse.json({
        students: [],
        total: 0
      })
    }

    // Fetch total lessons for the course (1 query)
    const allLessons = await lessonsDb.listByCourse(courseId)
    const totalLessons = allLessons.total

    // Extract user IDs
    const userIds = enrollments.documents.map((e: any) => e.userId)

    // Fetch ALL users at once instead of per-enrollment (1 query, not N)
    const allUsers = await usersDb.list({ limit: 5000 })
    const userMap = new Map(allUsers.documents.map((u: any) => [u.$id, u]))

    // Fetch ALL progress for all students at once (1 query, not N)
    const allProgress = await progressDb.listByCourseAndUsers(courseId, userIds)
    const progressMap = new Map(
      allProgress.documents.map((p: any) => [
        `${p.userId}-${courseId}`,
        p.total
      ])
    )

    // Map enrollments to student data (no queries needed, just lookups)
    const studentsData = enrollments.documents
      .map((enc: any) => {
        try {
          const student = userMap.get(enc.userId)
          if (!student) return null

          const studentProgress = progressMap.get(`${enc.userId}-${courseId}`) || 0
          const progressPercent = totalLessons > 0 
            ? Math.round((studentProgress / totalLessons) * 100) 
            : 0

          return {
            id: student.$id,
            name: student.name || "Unknown",
            email: student.email || "Unknown",
            progress: progressPercent,
            joinedAt: new Date(enc.$createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })
          }
        } catch {
          return null
        }
      })
      .filter((s: any) => s !== null)

    return NextResponse.json({
      students: studentsData,
      total: enrollments.total
    })
  } catch (error) {
    console.error("[API] GET /api/instructor/courses/[id]/students", error)
    return NextResponse.json({ error: "Failed to fetch student list" }, { status: 500 })
  }
}
