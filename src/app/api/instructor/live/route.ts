/**
 * @fileoverview GET/POST /api/instructor/live — create and manage instructor's own sessions.
 */
import { NextResponse, NextRequest } from "next/server"
import { liveSessionsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { ROLES } from "@/config/roles"
import { ID, Query } from "node-appwrite"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessions = await liveSessionsDb.list({
      queries: [
        Query.equal("instructorId", user.$id),
        Query.orderDesc("scheduledAt")
      ]
    })

    return NextResponse.json({ 
      sessions: sessions.documents.map((s: any) => ({
        id: s.$id,
        title: s.title,
        description: s.description,
        scheduledAt: s.scheduledAt,
        duration: s.durationMinutes,
        status: s.status,
        roomUrl: `/app/live/${s.$id}`
      }))
    })
  } catch (error) {
    console.error("[API] GET /api/instructor/live", error)
    return NextResponse.json({ error: "Failed to fetch instructor sessions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, scheduledAt, duration } = body

    if (!title || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const session = await liveSessionsDb.create(ID.unique(), {
      title,
      description: description || "",
      scheduledAt,
      durationMinutes: parseInt(duration) || 60,
      instructorId: user.$id,
      status: "scheduled",
      streamId: ID.unique() // Identity for the Stream call
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error("[API] POST /api/instructor/live", error)
    return NextResponse.json({ error: "Failed to schedule live session" }, { status: 500 })
  }
}
