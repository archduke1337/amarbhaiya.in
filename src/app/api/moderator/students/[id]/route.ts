/**
 * @fileoverview GET /api/moderator/students/[id] — Fetch detailed user info for investigation.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { usersDb, moderationActionsDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const investigator = await getLoggedInUser()
    const { id: targetId } = await params

    if (!investigator || (!investigator.labels.includes(ROLES.MODERATOR) && !investigator.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user, actions] = await Promise.all([
      usersDb.get(targetId),
      moderationActionsDb.listByTarget(targetId)
    ])

    return NextResponse.json({
      student: {
        id: user.$id,
        name: (user as any).name || "Unknown",
        email: (user as any).email || "Unknown",
        labels: user.labels || [],
        joinedAt: user.$createdAt,
        history: actions.documents
      }
    })
  } catch (error) {
    console.error("[API] GET /api/moderator/students/[id]", error)
    return NextResponse.json({ error: "Failed to fetch student details" }, { status: 500 })
  }
}
