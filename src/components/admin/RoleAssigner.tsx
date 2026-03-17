/**
 * @fileoverview RoleAssigner - admin panel role control.
 */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ROLES, type Role } from "@/config/roles"

type RoleAssignerProps = {
  userId: string
  currentRole: Role
}

const ROLES_LIST: Role[] = [ROLES.STUDENT, ROLES.MODERATOR, ROLES.INSTRUCTOR, ROLES.ADMIN]

export function RoleAssigner({ userId, currentRole }: RoleAssignerProps) {
  const router = useRouter()
  const [role, setRole] = useState<Role>(currentRole)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.error || "Failed to update role")
      }

      router.refresh()
    } catch (err) {
      setError((err && typeof err === 'object' && 'message' in err) ? String((err as any).message) : "Failed to update role")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <select
          className="h-8 rounded-md border bg-background px-2 text-xs"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          disabled={saving}
        >
          {ROLES_LIST.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Button size="xs" type="button" onClick={handleSave} disabled={saving || role === currentRole}>
          {saving ? "Saving" : "Save"}
        </Button>
      </div>
      {error ? <p className="text-[10px] text-destructive">{error}</p> : null}
    </div>
  )
}
