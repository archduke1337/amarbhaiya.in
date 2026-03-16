/**
 * @fileoverview GET /api/public/community — fetch real community stats and recent activity.
 */
import { NextResponse } from "next/server"
import { forumThreadsDb, usersDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"

export async function GET() {
  try {
    const [threads, users] = await Promise.all([
      forumThreadsDb.list({
        queries: [Query.orderDesc("$createdAt"), Query.limit(3)],
      }),
      usersDb.list({ limit: 1 }), // Just to get total users
    ])

    const forumActivity = await Promise.all(
      threads.documents.map(async (thread) => {
        let author = "Community Member"
        try {
          if (thread.userId) {
            const user = await usersDb.get(thread.userId)
            author = user.name || author
          }
        } catch (e) {
          // Ignore failures for individual user fetches
        }

        // Calculate time ago informally or just return ISO
        return {
          author,
          topic: thread.title || "Untitled Discussion",
          time: new Date(thread.$createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          likes: 0, // Assume 0 likes for now if no likes field
          replies: thread.replyCount || 0,
        }
      })
    )

    return NextResponse.json({
      activity: forumActivity,
      stats: {
        dailyActiveUsers: users.total,
        knowledgeContributions: threads.total, // Could be threads + replies
      },
    })
  } catch (error) {
    console.error("[API] GET /api/public/community", error)
    return NextResponse.json({ activity: [], stats: { dailyActiveUsers: 0, knowledgeContributions: 0 } })
  }
}
