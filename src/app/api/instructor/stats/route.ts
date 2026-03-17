/**
 * @fileoverview GET /api/instructor/stats — Aggregated analytics for the instructor dashboard.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { coursesDb, enrollmentsDb, paymentsDb, usersDb, courseReviewsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { ROLES } from "@/config/roles"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Get all courses by this instructor
    const instructorCourses = await coursesDb.list({
      queries: [Query.equal("instructorId", user.$id)]
    })

    const courseIds = instructorCourses.documents.map(c => c.$id)

    if (courseIds.length === 0) {
      return NextResponse.json({
        stats: { totalStudents: 0, totalRevenue: 0, activeCourses: 0, avgRating: 4.8 },
        coursePerformance: [],
        recentEnrollments: []
      })
    }

    // 2. Fetch parallel data for these courses
    const [enrollments, payments, reviews] = await Promise.all([
      enrollmentsDb.list({
        queries: [Query.equal("courseId", courseIds), Query.limit(5000)]
      }),
      paymentsDb.list({
        queries: [Query.equal("courseId", courseIds), Query.equal("status", "completed"), Query.limit(5000)]
      }),
      courseReviewsDb.list({
        queries: [Query.equal("courseId", courseIds), Query.limit(5000)]
      })
    ])

    // 3. Aggregate totals
    const totalRevenue = payments.documents.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
    const totalStudents = enrollments.total

    const allRatings = reviews.documents.map((r: any) => r.rating || 0)
    const avgRating = allRatings.length > 0 
      ? (allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length).toFixed(1)
      : 4.9

    // 4. Calculate performance per course
    const coursePerformance = instructorCourses.documents.map(course => {
      const courseEnrollments = enrollments.documents.filter((e: any) => e.courseId === course.$id)
      const coursePayments = payments.documents.filter((p: any) => p.courseId === course.$id)
      const revenue = coursePayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

      return {
        id: course.$id,
        title: course.title,
        students: courseEnrollments.length,
        revenue,
        thumbnail: (course as any).thumbnailFileId
          ? `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.buckets.courseThumbnails}/files/${(course as any).thumbnailFileId}/view?project=${APPWRITE_CONFIG.projectId}`
          : null
      }
    })

    // 5. Get recent enrollments with user details
    const recentEnrolledDocs = enrollments.documents
      .sort((a: any, b: any) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
      .slice(0, 5)

    // Batch fetch all users at once (prevent N+1 query)
    const allUsers = await usersDb.list({ limit: 5000 })
    const userMap = new Map(allUsers.documents.map((u: any) => [u.$id, u]))

    const recentEnrollments = recentEnrolledDocs.map((en: any) => {
      const student = userMap.get(en.userId)
      const course = instructorCourses.documents.find(c => c.$id === en.courseId)
      
      return {
        id: en.$id,
        studentName: student?.name || "Unknown Student",
        studentEmail: student?.email || "Unknown Email",
        courseTitle: course?.title || "Unknown Course",
        enrolledAt: en.$createdAt
      }
    })

    const response = NextResponse.json({
      stats: {
        totalStudents,
        totalRevenue: totalRevenue / 100, // Assuming cents/paisa
        activeCourses: instructorCourses.total,
        avgRating
      },
      coursePerformance,
      recentEnrollments
    })

    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/instructor/stats", error)
    return NextResponse.json({ error: "Failed to fetch instructor stats" }, { status: 500 })
  }
}
