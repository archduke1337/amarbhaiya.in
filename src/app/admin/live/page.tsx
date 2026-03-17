/**
 * @fileoverview Admin live sessions management.
 */
import { Query } from "node-appwrite"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { liveSessionsDb } from "@/lib/appwrite/database"

export default async function AdminLivePage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  try {
    const sessions = await liveSessionsDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 80 })

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.documents.map((doc: any) => (
              <TableRow key={doc.$id}>
                <TableCell className="font-medium">{doc.title || "Untitled"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.instructorId || "-"}</TableCell>
                <TableCell>
                  <Badge variant={doc.status === "scheduled" ? "secondary" : "outline"}>
                    {doc.status || "unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {doc.scheduledAt ? new Date(doc.scheduledAt).toLocaleString() : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  } catch (err) {
    console.error("[Admin] Failed to fetch live sessions:", err)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load live sessions. Please try refreshing the page.
        </div>
      </div>
    )
  }
}
