/**
 * @fileoverview GET /api/community/threads/[id]/replies — list all replies in a thread.
 * POST /api/community/threads/[id]/replies — post a reply to a thread.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { forumThreadsDb, forumRepliesDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: threadId } = await params
    
    const [thread, repliesResult] = await Promise.all([
      forumThreadsDb.get(threadId),
      forumRepliesDb.listByThread(threadId)
    ])

    return NextResponse.json({ 
      thread, 
      replies: repliesResult.documents 
    })
  } catch (error) {
    console.error("[API] GET /api/community/threads/[id]/replies", error)
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: threadId } = await params
    const { content } = await req.json()
    const normalizedContent = typeof content === "string" ? content.trim() : ""

    if (!normalizedContent) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const thread = await forumThreadsDb.get(threadId)
    if ((thread as any).isLocked) {
      return NextResponse.json({ error: "Thread is locked" }, { status: 403 })
    }

    if ((thread as any).isDeleted) {
      return NextResponse.json({ error: "Thread is deleted" }, { status: 404 })
    }

    const isInstructor = user.labels.includes(ROLES.INSTRUCTOR) || user.labels.includes(ROLES.ADMIN)

    const reply = await forumRepliesDb.create(ID.unique(), {
      threadId,
      userId: user.$id,
      authorName: user.name,
      content: normalizedContent,
      isInstructor,
    })

    await forumThreadsDb.update(threadId, {
      replyCount: ((thread as any).replyCount ?? 0) + 1,
      lastReplyAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("[API] POST /api/community/threads/[id]/replies", error)
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 })
  }
}
