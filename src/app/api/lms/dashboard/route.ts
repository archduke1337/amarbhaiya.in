/**
 * @fileoverview GET /api/lms/dashboard — Fetches student dashboard metrics.
 */
import { NextResponse } from "next/server"
import { enrollmentsDb, certificatesDb, coursesDb, lessonsDb, progressDb } from "@/lib/appwrite/database"
import { getCurrentUser } from "@/lib/appwrite/auth"       

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch Enrollments for KPIs AND Resume Course data
    const enrollmentsResult = await enrollmentsDb.listByUser(user.$id)
    const enrolledCourses = enrollmentsResult.documents.length

    // 2. Fetch Certificates for KPIs
    const certificatesResult = await certificatesDb.listByUser(user.$id)
    const certificatesEarned = certificatesResult.documents.length

    // 3. Fetch specific active course data with REAL progress
    let activeCourse = null
    let totalCompletedLessons = 0
    
    if (enrollmentsResult.documents.length > 0) {
        // Just take the first enrollment as "active" for now
        const firstEn = enrollmentsResult.documents[0] as any
        try {
          const [courseObj, allLessons, userProgress] = await Promise.all([
            coursesDb.get(firstEn.courseId),
            lessonsDb.listByCourse(firstEn.courseId),
            progressDb.listByUserAndCourse(user.$id, firstEn.courseId)
          ])
          
          totalCompletedLessons = userProgress.total
          const progressPercent = allLessons.total > 0 
            ? Math.round((userProgress.total / allLessons.total) * 100) 
            : 0

          activeCourse = {
            id: courseObj.$id,
            title: (courseObj as any).title,
            description: (courseObj as any).description || "Continue your development journey.",
            category: (courseObj as any).category || "Learning",
            progress: progressPercent,
           }
        } catch (err) {
          console.error("Failed fetching active course doc", err)
        }
    }

    // Heuristic: Each lesson is ~15 minutes (0.25h)
    const completedHours = parseFloat((totalCompletedLessons * 0.25).toFixed(1))

    return NextResponse.json({
      stats: {
        enrolledCourses,
        completedHours,
        certificatesEarned
      },
      activeCourse
    })
  } catch (error) {
    console.error("[API] GET /api/lms/dashboard", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
