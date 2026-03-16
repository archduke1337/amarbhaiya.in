/**
 * @fileoverview PATCH /api/instructor/modules/[id] — update module.
 * DELETE /api/instructor/modules/[id] — delete module.
 */
import { NextRequest, NextResponse } from "next/server"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { modulesDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import { verifyCourseOwnership } from "@/lib/services/instructor"

const ALLOWED_MODULE_FIELDS = ["title", "description", "order", "isPublished"] as const

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Fetch the module to get its courseId, then verify ownership
    const existingModule = await modulesDb.get(id)
    if (!existingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    const ownership = await verifyCourseOwnership(user, existingModule.courseId as string)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    // Whitelist allowed fields
    const body = await req.json()
    const updates: Record<string, unknown> = {}
    for (const field of ALLOWED_MODULE_FIELDS) {
      if (field in body) updates[field] = body[field]
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    const module = await modulesDb.update(id, updates)
    return NextResponse.json({ success: true, module })
  } catch (error) {
    console.error("[API] PATCH /api/instructor/modules/[id]", error)
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Fetch module to verify course ownership
    const existingModule = await modulesDb.get(id)
    if (!existingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    const ownership = await verifyCourseOwnership(user, existingModule.courseId as string)
    if (!ownership.authorized) {
      return NextResponse.json({ error: ownership.error }, { status: ownership.status })
    }

    await modulesDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /api/instructor/modules/[id]", error)
    return NextResponse.json({ error: "Failed to delete module" }, { status: 500 })
  }
}
