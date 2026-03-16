/**
 * @fileoverview GET /api/lms/progress/report — detailed learning report for students.
 */
import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { enrollmentsDb, coursesDb, progressDb, lessonsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const enrollments = await enrollmentsDb.listByUser(user.$id)
    
    const reportData = await Promise.all(enrollments.documents.map(async (en: any) => {
      try {
        const courseId = en.courseId
        const [course, allLessons, userProgress] = await Promise.all([
          coursesDb.get(courseId),
          lessonsDb.listByCourse(courseId),
          progressDb.listByUserAndCourse(user.$id, courseId)
        ])

        const totalLessons = allLessons.total
        const completedLessons = userProgress.total
        const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        
        // Find last completed lesson for "last activity"
        const lastActivityDoc = userProgress.documents.sort((a: any, b: any) => 
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        )[0]

        return {
          courseId,
          title: (course as any).title,
          totalLessons,
          completedLessons,
          percent,
          lastActivity: lastActivityDoc?.$createdAt || en.$createdAt,
          thumbnail: (course as any).thumbnailId
        }
      } catch (err) {
        return null
      }
    }))

    const finalReport = reportData.filter(d => d !== null)

    return NextResponse.json({
      studentName: user.name,
      overallProgress: finalReport.reduce((acc, curr) => acc + curr!.percent, 0) / (finalReport.length || 1),
      courses: finalReport
    })
  } catch (error) {
    console.error("[API] GET /api/lms/progress/report", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
