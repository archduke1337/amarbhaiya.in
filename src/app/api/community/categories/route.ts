/**
 * @fileoverview GET /api/community/categories — list all forum categories.
 */
import { NextResponse } from "next/server"
import { forumCategoriesDb } from "@/lib/appwrite/database"

export async function GET() {
  try {
    const result = await forumCategoriesDb.list()
    
    const categories = result.documents.map(cat => ({
      ...cat,
      threadCount: cat.threadCount || 0,
      membersCount: cat.membersCount || 0,
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("[API] GET /api/community/categories", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
