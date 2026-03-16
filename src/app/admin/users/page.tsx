/**
 * @fileoverview Admin users list — all users with role assignment.
 */
import { Query } from "node-appwrite"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { usersDb } from "@/lib/appwrite/database"
import { UserTable } from "@/components/admin/UserTable"

export default async function AdminUsersPage() {
  const user = await getLoggedInUser()
  if (!user || !user.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const result = await usersDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 100 })
  const users = result.documents.map((doc: any) => ({
    id: doc.$id,
    userId: doc.userId || doc.$id,
    name: doc.name || "",
    email: doc.email || "",
    labels: doc.labels || [],
    isActive: doc.isActive,
    isVerified: doc.isVerified,
    joinedAt: doc.$createdAt,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <UserTable users={users} />
    </div>
  )
}
