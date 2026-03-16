/**
 * @fileoverview GET /api/moderation/actions?userId= — get moderation actions for a user.
 * POST — create a new moderation action (moderator/admin only).
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ID } from "node-appwrite"
import { moderationActionsDb, auditLogsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { getHighestRole } from "@/config/roles"

export async function GET(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = getHighestRole(user.labels ?? [])
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId param required" }, { status: 400 })
    }

    const result = await moderationActionsDb.listByTarget(userId)

    return NextResponse.json({ actions: result.documents })
  } catch (error) {
    console.error("[API] GET /api/moderation/actions", error)
    return NextResponse.json({ error: "Failed to fetch actions" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = getHighestRole(user.labels ?? [])
    if (role !== "admin" && role !== "moderator") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()

    // 1. Validate Input
    const moderationSchema = z.object({
      targetUserId: z.string().min(1),
      action: z.enum(["warn", "mute", "timeout", "ban", "delete_content", "restore_content"]),
      reason: z.string().min(5),
      targetType: z.enum(["user", "comment", "forum_post", "forum_reply"]).optional().default("user"),
      targetId: z.string().optional(),
      expiresAt: z.string().datetime().optional().nullable(),
    })

    const result = moderationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.format() }, { status: 400 })
    }

    const data = result.data

    const action = await moderationActionsDb.create(ID.unique(), {
      targetUserId: data.targetUserId,
      moderatorId: user.$id,
      action: data.action,
      reason: data.reason,
      targetType: data.targetType,
      targetId: data.targetId || data.targetUserId,
      expiresAt: data.expiresAt || null,
      isReverted: false,
    })

    // Log the audit event
    await auditLogsDb.create(ID.unique(), {
      userId: user.$id,
      action: `moderation:${data.action}`,
      targetType: data.targetType,
      targetId: data.targetId || data.targetUserId,
      metadata: { reason: data.reason, targetUserId: data.targetUserId },
    })

    return NextResponse.json({ action }, { status: 201 })
  } catch (error) {
    console.error("[API] POST /api/moderation/actions", error)
    return NextResponse.json({ error: "Failed to create action" }, { status: 500 })
  }
}
