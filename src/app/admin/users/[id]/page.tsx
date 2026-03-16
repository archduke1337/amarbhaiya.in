/**
 * @fileoverview Admin user detail — profile, roles, activity, actions.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { moderationActionsDb, usersDb } from "@/lib/appwrite/database"

type Props = { params: Promise<{ id: string }> }

export default async function AdminUserDetailPage({ params }: Props) {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const { id } = await params
  const [user, history] = await Promise.all([
    usersDb.get(id, true),
    moderationActionsDb.listByTarget(id),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Detail</h1>
      <p className="text-muted-foreground">Profile ID: {id}</p>

      <Card>
        <CardHeader>
          <CardTitle>{(user as any).name || "Unnamed User"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Email: {(user as any).email || "-"}</p>
          <p>Auth User ID: {(user as any).userId || "-"}</p>
          <p>Joined: {new Date((user as any).$createdAt).toLocaleString()}</p>
          <div className="flex flex-wrap gap-2">
            {((user as any).labels || []).map((label: string) => (
              <Badge key={label} variant="outline" className="capitalize">
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moderation History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {history.documents.length === 0 ? (
            <p className="text-muted-foreground">No moderation actions found.</p>
          ) : (
            history.documents.slice(0, 20).map((entry: any) => (
              <div key={entry.$id} className="rounded-md border p-3">
                <p className="font-medium capitalize">{entry.action || "action"}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.reason || "No reason"} • {new Date(entry.$createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
