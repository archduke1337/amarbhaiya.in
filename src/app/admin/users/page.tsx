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

  try {
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
  } catch (err) {
    console.error("[Admin] Failed to fetch users:", err)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load users. Please try refreshing the page.
        </div>
      </div>
    )
  }
}
