/**
 * @fileoverview GET /api/public/stats — Publicly accessible platform stats for landing page.
 */
import { NextResponse } from "next/server"
import { usersDb, coursesDb } from "@/lib/appwrite/database"

export async function GET() {
  try {
    const [users, courses] = await Promise.all([
      usersDb.list({ limit: 1 }),
      coursesDb.list({ limit: 1 })
    ])

    return NextResponse.json({
      membersCount: users.total,
      coursesCount: courses.total,
      averageRating: 0,
      successRate: 0
    })
  } catch (error) {
    console.error("[API] GET /api/public/stats", error)
    return NextResponse.json({ error: "Failed to fetch public stats" }, { status: 500 })
  }
}
