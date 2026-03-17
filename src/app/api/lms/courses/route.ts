/**
 * @fileoverview GET /api/lms/courses — list all published courses.
 * Supports ?category=, ?search=, ?limit=, ?offset= query params.
 */

import { NextRequest, NextResponse } from "next/server"
import { Query } from "node-appwrite"
import { coursesDb, categoriesDb } from "@/lib/appwrite/database"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

function getThumbnailUrl(fileId?: string) {
  if (!fileId) return null

  return `${APPWRITE_CONFIG.endpoint}/storage/buckets/${APPWRITE_CONFIG.buckets.courseThumbnails}/files/${fileId}/view?project=${APPWRITE_CONFIG.projectId}`
}

export async function GET(req: NextRequest) {
  // Rate limiting - public endpoint
  const rateLimitResponse = enforceRateLimit(req, "PUBLIC")
  if (rateLimitResponse) return rateLimitResponse

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

    const response = NextResponse.json({
      courses: result.documents.map((doc: any) => ({
        ...doc,
        thumbnailUrl: getThumbnailUrl(doc.thumbnailFileId),
      })),
      total: result.total,
    })

    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/lms/courses", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
