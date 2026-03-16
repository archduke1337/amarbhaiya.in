/**
 * @fileoverview GET /api/admin/stats — Fetches platform-wide stats for admin dashboard.
 */
import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { usersDb, coursesDb, paymentsDb, moderationActionsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { ROLES } from "@/config/roles"

export async function GET() {
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

    // Map course IDs to titles for the breakdown
    const courseBreakedown = await Promise.all(
      Object.entries(revenueByCourse).map(async ([id, rev]) => {
        try {
          const c = await coursesDb.get(id)
          return { id, title: (c as any).title, revenue: rev }
        } catch {
          return { id, title: "Deleted Course", revenue: rev }
        }
      })
    )

    return NextResponse.json({
      stats: {
        totalRevenue: platformRevenue,
        totalUsers: users.total,
        activeCourses: courses.total,
        systemAlerts: moderation.total,
      },
      revenueByCourse: courseBreakedown,
      recentActivity
    })
  } catch (error) {
    console.error("[API] GET /api/admin/stats", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
