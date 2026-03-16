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

    // Fetch enrollments
    const enrollments = await enrollmentsDb.listByCourse(courseId)

    // Fetch total lessons for the course
    const allLessons = await lessonsDb.listByCourse(courseId)
    const totalLessons = allLessons.total

    // Fetch user details and progress for each enrollment
    const studentsData = await Promise.all(
      enrollments.documents.map(async (enc: any) => {
        try {
          const [student, userProgress] = await Promise.all([
            usersDb.get(enc.userId),
            progressDb.listByUserAndCourse(enc.userId, courseId)
          ])

          const progressPercent = totalLessons > 0 
            ? Math.round((userProgress.total / totalLessons) * 100) 
            : 0

          return {
            id: student.$id,
            name: (student as any).name || "Unknown",
            email: (student as any).email || "Unknown",
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
    )

    return NextResponse.json({
      students: studentsData.filter(s => s !== null),
      total: enrollments.total
    })
  } catch (error) {
    console.error("[API] GET /api/instructor/courses/[id]/students", error)
    return NextResponse.json({ error: "Failed to fetch student list" }, { status: 500 })
  }
}
