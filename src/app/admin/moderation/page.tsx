/**
 * @fileoverview All moderation actions + revert capability.
 */
import { Query } from "node-appwrite"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { moderationActionsDb } from "@/lib/appwrite/database"

export default async function AdminModerationPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const [pending, resolved, recent] = await Promise.all([
    moderationActionsDb.list({ queries: [Query.equal("status", "pending")], limit: 1 }),
    moderationActionsDb.list({ queries: [Query.equal("status", "resolved")], limit: 1 }),
    moderationActionsDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 30 }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moderation</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-sm">Pending Actions</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{pending.total}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Resolved Actions</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{resolved.total}</CardContent></Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Moderator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.documents.map((doc: any) => (
            <TableRow key={doc.$id}>
              <TableCell className="capitalize">{doc.action || "-"}</TableCell>
              <TableCell>{doc.targetType || "-"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{doc.moderatorId || "-"}</TableCell>
              <TableCell><Badge variant={doc.status === "resolved" ? "secondary" : "outline"}>{doc.status || "pending"}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{doc.reason || "-"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(doc.$createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
