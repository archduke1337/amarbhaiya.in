/**
 * @fileoverview GET /api/lms/dashboard/sessions — Fetch upcoming live sessions for student.
 */
import { NextResponse } from "next/server"
import { liveSessionsDb } from "@/lib/appwrite/database"
import { getCurrentUser } from "@/lib/appwrite/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await liveSessionsDb.listUpcoming()

    return NextResponse.json({
      sessions: sessions.documents.map((s: any) => ({
        id: s.$id,
        title: s.title,
        description: s.description,
        scheduledAt: s.scheduledAt,
        duration: s.durationMinutes,
        zoomLink: s.streamId ? `/app/live/${s.$id}` : null
      }))
    })
  } catch (error) {
    console.error("[API] GET /api/lms/dashboard/sessions", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
