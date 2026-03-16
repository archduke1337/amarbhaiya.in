/**
 * @fileoverview POST /api/notifications/[id]/read — mark a notification as read.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { notificationsDb } from "@/lib/appwrite/database"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id: notificationId } = await params

    // Verify ownership
    const notification = await notificationsDb.get(notificationId)
    if (notification.userId !== user.$id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await notificationsDb.markRead(notificationId)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[API] POST /api/notifications/[id]/read", err)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
