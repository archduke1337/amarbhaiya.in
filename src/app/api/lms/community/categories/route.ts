/**
 * @fileoverview GET /api/lms/community/categories — list all active forum categories.
 */

import { NextRequest, NextResponse } from "next/server"
import { Query } from "node-appwrite"
import { forumCategoriesDb } from "@/lib/appwrite/database"

export async function GET(req: NextRequest) {
  try {
    const result = await forumCategoriesDb.list({
      queries: [Query.equal("isActive", true), Query.orderAsc("order")],
    })

    return NextResponse.json({ categories: result.documents })
  } catch (error) {
    console.error("[API] GET /api/lms/community/categories", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
