/**
 * @fileoverview GET /api/public/stats — Publicly accessible platform stats for landing page.
 */
import { NextRequest, NextResponse } from "next/server"
import { usersDb, coursesDb } from "@/lib/appwrite/database"
import { enforceRateLimit, addRateLimitHeaders } from "@/lib/ratelimit-helper"

export async function GET(req: NextRequest) {
  // Rate limiting - public endpoint
  const rateLimitResponse = enforceRateLimit(req, "PUBLIC")
  if (rateLimitResponse) return rateLimitResponse

  try {
    const [users, courses] = await Promise.all([
      usersDb.list({ limit: 1 }),
      coursesDb.list({ limit: 1 })
    ])

    const response = NextResponse.json({
      membersCount: users.total,
      coursesCount: courses.total,
      averageRating: 0,
      successRate: 0
    })

    return addRateLimitHeaders(response, req)
  } catch (error) {
    console.error("[API] GET /api/public/stats", error)
    return NextResponse.json({ error: "Failed to fetch public stats" }, { status: 500 })
  }
}
