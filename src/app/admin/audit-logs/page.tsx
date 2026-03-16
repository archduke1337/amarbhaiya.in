/**
 * @fileoverview Full platform audit trail.
 */
import { Query } from "node-appwrite"
import { AuditLogTable } from "@/components/admin/AuditLogTable"
import { ROLES } from "@/config/roles"
import { auditLogsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function AdminAuditLogsPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const result = await auditLogsDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 100 })
  const logs = result.documents.map((doc: any) => ({
    id: doc.$id,
    userId: doc.userId || "",
    action: doc.action || "unknown",
    targetType: doc.targetType || "unknown",
    targetId: doc.targetId || "",
    createdAt: doc.$createdAt,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Audit Logs</h1>
      <AuditLogTable logs={logs} />
    </div>
  )
}
