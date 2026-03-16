/**
 * @fileoverview GET /api/community/categories/[id]/threads — list all threads in a category.
 */
import { NextRequest, NextResponse } from "next/server"
import { forumThreadsDb, forumCategoriesDb } from "@/lib/appwrite/database"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: categoryId } = await params
    
    const [category, threadsResult] = await Promise.all([
      forumCategoriesDb.get(categoryId),
      forumThreadsDb.listByCategory(categoryId)
    ])

    return NextResponse.json({ 
      category, 
      threads: threadsResult.documents 
    })
  } catch (error) {
    console.error("[API] GET /api/community/categories/[id]/threads", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}
