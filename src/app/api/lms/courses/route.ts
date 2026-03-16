/**
 * @fileoverview GET /api/lms/courses — list all published courses.
 * Supports ?category=, ?search=, ?limit=, ?offset= query params.
 */

import { NextRequest, NextResponse } from "next/server"
import { Query } from "node-appwrite"
import { coursesDb, categoriesDb } from "@/lib/appwrite/database"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") ?? "25", 10)
    const offset = parseInt(searchParams.get("offset") ?? "0", 10)

    const queries: string[] = [Query.equal("status", "published")]

    if (category) {
      queries.push(Query.equal("categoryId", category))
    }

    if (search) {
      queries.push(Query.search("title", search))
    }

    queries.push(Query.orderDesc("$createdAt"))

    const result = await coursesDb.list({ queries, limit, offset })

    return NextResponse.json({
      courses: result.documents,
      total: result.total,
    })
  } catch (error) {
    console.error("[API] GET /api/lms/courses", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
