/**
 * @fileoverview GET /api/moderation/reports — List all pending flagged content.
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

    // List pending reports
    const reports = await moderationActionsDb.list({
      queries: [
        Query.equal("status", "pending"),
        Query.orderDesc("$createdAt")
      ]
    })

    return NextResponse.json({
      reports: reports.documents.map((r: any) => ({
        id: r.$id,
        type: r.targetType || "Unknown",
        content: r.reason || "No content provided",
        author: r.targetUserId || "Unknown",
        reportedBy: r.moderatorId || "System",
        severity: r.action || "Medium",
        date: new Date(r.$createdAt).toLocaleString()
      }))
    })
  } catch (error) {
    console.error("[API] GET /api/moderation/reports", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
