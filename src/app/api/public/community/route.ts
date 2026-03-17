/**
 * @fileoverview GET /api/public/community — fetch real community stats and recent activity.
 */
import { NextRequest, NextResponse } from "next/server"
import { forumThreadsDb, usersDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

export async function GET(req: NextRequest) {
  // Rate limiting - public endpoint
  const rateLimitResponse = enforceRateLimit(req, "PUBLIC")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const [threads, users] = await Promise.all([
      forumThreadsDb.list({
        queries: [Query.orderDesc("$createdAt"), Query.limit(3)],
      }),
      usersDb.list({ limit: 1 }), // Just to get total users
    ])

    // Batch fetch all users at once instead of per-thread (prevent N+1)
    const userIds = [...new Set(threads.documents.map((t: any) => t.userId).filter(Boolean))]
    const allUsers = await usersDb.list({ limit: 5000 })
    const userMap = new Map(allUsers.documents.map((u: any) => [u.$id, u]))

    const forumActivity = threads.documents.map((thread: any) => {
      const user = userMap.get(thread.userId)
      return {
        author: user?.name || "Community Member",
        topic: thread.title || "Untitled Discussion",
        time: new Date(thread.$createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        likes: 0, // Assume 0 likes for now if no likes field
        replies: thread.replyCount || 0,
      }
    })

    const response = NextResponse.json({
      activity: forumActivity,
      stats: {
        dailyActiveUsers: users.total,
        knowledgeContributions: threads.total, // Could be threads + replies
      },
    })

    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/public/community", error)
    return NextResponse.json({ activity: [], stats: { dailyActiveUsers: 0, knowledgeContributions: 0 } })
  }
}
