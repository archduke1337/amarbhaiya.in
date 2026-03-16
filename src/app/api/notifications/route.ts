/**
 * @fileoverview GET /api/notifications — list notifications for current user.
 */
import { NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { notificationsDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"

export async function GET() {
  try {
    const user = await getLoggedInUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const result = await notificationsDb.list({
      queries: [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")],
      limit: 20
    })

    const unreadCount = result.documents.filter(n => !n.isRead).length

    return NextResponse.json({ 
      notifications: result.documents,
      unreadCount
    })
  } catch (err) {
    console.error("[API] GET /api/notifications", err)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
