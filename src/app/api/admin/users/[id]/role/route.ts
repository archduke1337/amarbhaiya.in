import { NextRequest, NextResponse } from "next/server"
import { createAdminClient, getLoggedInUser } from "@/lib/appwrite/server"
import { auditLogsDb, usersDb } from "@/lib/appwrite/database"
import { ROLES, type Role } from "@/config/roles"

const ALLOWED_ROLES: Role[] = [ROLES.STUDENT, ROLES.MODERATOR, ROLES.INSTRUCTOR, ROLES.ADMIN]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await getLoggedInUser()
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!actor.labels.includes(ROLES.ADMIN)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const role = String(body?.role ?? "") as Role

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const profile = await usersDb.get(id, true)
    const authUserId = String((profile as any).userId ?? id)

    const { users } = await createAdminClient()
    const authUser = await users.get(authUserId)

    const nonRoleLabels = (authUser.labels ?? []).filter(
      (label: string) => !ALLOWED_ROLES.includes(label as Role)
    )
    const nextLabels = Array.from(new Set([...nonRoleLabels, role]))

    await Promise.all([
      users.updateLabels(authUserId, nextLabels),
      usersDb.update(id, { labels: nextLabels }),
      auditLogsDb.create((globalThis as any).crypto?.randomUUID?.() ?? `${Date.now()}-${actor.$id}`, {
        userId: actor.$id,
        action: "admin.role.update",
        targetType: "user",
        targetId: authUserId,
        metadata: JSON.stringify({ role, profileId: id }),
      }),
    ])

    return NextResponse.json({ success: true, labels: nextLabels })
  } catch (error) {
    console.error("[API] PATCH /api/admin/users/[id]/role", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}
