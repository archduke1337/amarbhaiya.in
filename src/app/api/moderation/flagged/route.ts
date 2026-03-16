/**
 * @fileoverview GET /api/moderation/flagged — list all flagged content.
 * Aggregates flagged comments, threads, and replies.
 */

import { NextRequest, NextResponse } from "next/server"
import { Query } from "node-appwrite"
import { courseCommentsDb, forumThreadsDb, forumRepliesDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { getHighestRole } from "@/config/roles"

export async function GET(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = getHighestRole(user.labels ?? [])
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch flagged content from all sources
    const [flaggedComments, flaggedThreads, flaggedReplies] = await Promise.all([
      courseCommentsDb.list({
        queries: [Query.equal("isFlagged", true), Query.orderDesc("$createdAt")],
        limit: 50,
      }),
      forumThreadsDb.list({
        queries: [Query.equal("isFlagged", true), Query.orderDesc("$createdAt")],
        limit: 50,
      }),
      forumRepliesDb.list({
        queries: [Query.equal("isFlagged", true), Query.orderDesc("$createdAt")],
        limit: 50,
      }),
    ])

    const items = [
      ...flaggedComments.documents.map((d) => ({ ...d, _type: "comment" as const })),
      ...flaggedThreads.documents.map((d) => ({ ...d, _type: "thread" as const })),
      ...flaggedReplies.documents.map((d) => ({ ...d, _type: "reply" as const })),
    ].sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())

    return NextResponse.json({ items })
  } catch (error) {
    console.error("[API] GET /api/moderation/flagged", error)
    return NextResponse.json({ error: "Failed to fetch flagged content" }, { status: 500 })
  }
}
