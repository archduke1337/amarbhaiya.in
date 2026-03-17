/**
 * @fileoverview GET /api/admin/stats — Fetches platform-wide stats for admin dashboard.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { usersDb, coursesDb, paymentsDb, moderationActionsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { ROLES } from "@/config/roles"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

export async function GET(req: NextRequest) {
  // Rate limiting - admin endpoint
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const user = await getLoggedInUser()
    if (!user || !user.labels.includes(ROLES.ADMIN)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parallel fetch for speed
    const [users, courses, payments, moderation, recentUsers, recentMod] = await Promise.all([
      usersDb.list({ limit: 1 }),
      coursesDb.list({ limit: 1 }),
      paymentsDb.list({ limit: 1 }),
      moderationActionsDb.list({ limit: 1 }),
      usersDb.list({ limit: 5, queries: [Query.orderDesc("$createdAt")] }),
      moderationActionsDb.list({ limit: 5, queries: [Query.orderDesc("$createdAt")] })
    ])

    // Mix and match for a "Recent Activity" feed
    const recentActivity = [
      ...recentUsers.documents.map((u: any) => ({
        type: "User Registration",
        title: u.name || "New Student",
        subtitle: u.email,
        time: u.$createdAt
      })),
      ...recentMod.documents.map((m: any) => ({
        type: "Moderation Alert",
        title: `Flagged ${m.targetType}`,
        subtitle: m.reason || "Under review",
        time: m.$createdAt
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
    
    // Calculate real total revenue and breakdown by course
    const revenueByCourse: Record<string, number> = {}
    let platformRevenue = 0

    payments.documents.forEach((p: any) => {
      const amount = (p.amount || 0) / 100
      platformRevenue += amount
      
      const courseId = p.courseId || "Unknown"
      revenueByCourse[courseId] = (revenueByCourse[courseId] || 0) + amount
    })

    // Fetch ALL courses at once (1 query) instead of per-entry (N queries)
    const allCourses = await coursesDb.list({ limit: 5000 })
    const courseMap = new Map(allCourses.documents.map((c: any) => [c.$id, c]))

    // Map course IDs to titles using the pre-fetched courses (no additional queries needed)
    const courseBreakedown = Object.entries(revenueByCourse).map(([id, rev]) => {
      const course = courseMap.get(id)
      return {
        id,
        title: course?.title || "Deleted Course",
        revenue: rev
      }
    })

    const response = NextResponse.json({
      stats: {
        totalRevenue: platformRevenue,
        totalUsers: users.total,
        activeCourses: courses.total,
        systemAlerts: moderation.total,
      },
      revenueByCourse: courseBreakedown,
      recentActivity
    })

    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/admin/stats", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
