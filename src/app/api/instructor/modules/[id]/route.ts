/**
 * @fileoverview PATCH /api/instructor/modules/[id] — update module.
 * DELETE /api/instructor/modules/[id] — delete module.
 */
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { modulesDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import { verifyCourseOwnership } from "@/lib/services/instructor"
import { enforceRateLimit } from "@/lib/ratelimit-helper"

// Zod schema for module update
const updateModuleSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

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

    // Validate input with Zod
    const body = await req.json()
    const result = updateModuleSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const updates = result.data

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
