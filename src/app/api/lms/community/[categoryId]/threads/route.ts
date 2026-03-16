/**
 * @fileoverview GET /api/lms/community/[categoryId]/threads — list threads in a category.
 * POST — create a new thread.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { forumThreadsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const result = await forumThreadsDb.listByCategory(categoryId)

    return NextResponse.json({ threads: result.documents })
  } catch (error) {
    console.error("[API] GET /api/lms/community/[categoryId]/threads", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { categoryId } = await params
    const body = await req.json()

    const thread = await forumThreadsDb.create(ID.unique(), {
      categoryId,
      userId: user.$id,
      title: body.title,
      content: body.content,
      isPinned: false,
      isLocked: false,
      isFlagged: false,
      replyCount: 0,
    })

    return NextResponse.json({ thread }, { status: 201 })
  } catch (error) {
    console.error("[API] POST /api/lms/community/[categoryId]/threads", error)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  }
}
