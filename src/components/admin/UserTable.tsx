/**
 * @fileoverview UserTable - admin panel users table with role controls.
 */
"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getHighestRole, type Role } from "@/config/roles"
import { RoleAssigner } from "@/components/admin/RoleAssigner"

type AdminUserRow = {
  id: string
  userId: string
  name: string
  email: string
  labels: string[]
  isActive?: boolean
  isVerified?: boolean
  joinedAt: string
}

type UserTableProps = {
  users: AdminUserRow[]
}

export function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No users found.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Role Control</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const role = getHighestRole(user.labels) as Role
          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="space-y-0.5">
                  <Link className="font-semibold hover:underline" href={`/admin/users/${user.id}`}>
                    {user.name || "Unnamed User"}
                  </Link>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Badge variant={user.isActive === false ? "destructive" : "secondary"}>
                    {user.isActive === false ? "Inactive" : "Active"}
                  </Badge>
                  {user.isVerified ? <Badge variant="outline">Verified</Badge> : null}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {role}
                </Badge>
              </TableCell>
              <TableCell>
                <RoleAssigner userId={user.id} currentRole={role} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(user.joinedAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
