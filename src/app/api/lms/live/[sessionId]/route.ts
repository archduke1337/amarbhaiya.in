/**
 * @fileoverview GET /api/lms/live/[sessionId] — get a single live session.
 */

import { NextRequest, NextResponse } from "next/server"
import { liveSessionsDb } from "@/lib/appwrite/database"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const session = await liveSessionsDb.get(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("[API] GET /api/lms/live/[sessionId]", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}
