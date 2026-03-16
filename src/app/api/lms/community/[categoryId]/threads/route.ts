/**
 * @fileoverview GET /api/lms/community/[categoryId]/threads — list threads in a category.
 * POST — create a new thread.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { forumCategoriesDb, forumThreadsDb } from "@/lib/appwrite/database"
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

    const title = typeof body.title === "string" ? body.title.trim() : ""
    const content = typeof body.content === "string" ? body.content.trim() : ""

    if (!title || !content) {
      return NextResponse.json({ error: "title and content are required" }, { status: 400 })
    }

    const category = await forumCategoriesDb.get(categoryId)
    if (!(category as any).isActive) {
      return NextResponse.json({ error: "Category is inactive" }, { status: 403 })
    }

    const thread = await forumThreadsDb.create(ID.unique(), {
      categoryId,
      userId: user.$id,
      title,
      content,
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
