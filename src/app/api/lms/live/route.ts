/**
 * @fileoverview GET /api/lms/live — list upcoming and live sessions.
 */

import { NextRequest, NextResponse } from "next/server"
import { liveSessionsDb } from "@/lib/appwrite/database"

export async function GET(req: NextRequest) {
  try {
    const result = await liveSessionsDb.listUpcoming()

    return NextResponse.json({ sessions: result.documents })
  } catch (error) {
    console.error("[API] GET /api/lms/live", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}
