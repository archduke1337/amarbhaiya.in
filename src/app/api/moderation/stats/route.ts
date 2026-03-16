/**
 * @fileoverview GET /api/moderation/stats — Aggregated metrics for high-level community health.
 */
import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { moderationActionsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { ROLES } from "@/config/roles"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.MODERATOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 1. Fetch parallel counts
    const [pending, resolved, totalActions] = await Promise.all([
      moderationActionsDb.list({ queries: [Query.equal("status", "pending"), Query.limit(1)] }),
      moderationActionsDb.list({ queries: [Query.equal("status", "resolved"), Query.limit(1)] }),
      moderationActionsDb.list({ queries: [Query.limit(1)] })
    ])

    // 2. Fetch recent actions for activity feed
    const recentActions = await moderationActionsDb.list({
      queries: [Query.orderDesc("$createdAt"), Query.limit(5)]
    })

    return NextResponse.json({
      stats: {
        pendingReports: pending.total,
        resolvedToday: resolved.total, // Simplified as total resolved for now
        totalActions: totalActions.total,
        avgResponseTime: null
      },
      recentActions: recentActions.documents.map((a: any) => ({
        id: a.$id,
        action: a.action,
        target: a.targetType,
        reason: a.reason,
        status: a.status,
        timestamp: a.$createdAt
      }))
    })
  } catch (error) {
    console.error("[API] GET /api/moderation/stats", error)
    return NextResponse.json({ error: "Failed to fetch moderation stats" }, { status: 500 })
  }
}
