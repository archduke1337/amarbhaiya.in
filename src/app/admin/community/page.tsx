/**
 * @fileoverview Admin community management.
 */
import { Query } from "node-appwrite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROLES } from "@/config/roles"
import { forumCategoriesDb, forumRepliesDb, forumThreadsDb, moderationActionsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function AdminCommunityPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const [categories, threads, replies, flagged] = await Promise.all([
    forumCategoriesDb.list({ limit: 1 }),
    forumThreadsDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 8 }),
    forumRepliesDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 8 }),
    moderationActionsDb.list({ queries: [Query.equal("targetType", "community"), Query.orderDesc("$createdAt")], limit: 8 }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Community</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm">Categories</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{categories.total}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Threads</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{threads.total}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Replies</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{replies.total}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Flagged Items</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{flagged.total}</CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Threads</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {threads.documents.map((thread: any) => (
              <div key={thread.$id} className="rounded-md border p-3">
                <p className="font-medium line-clamp-1">{thread.title || "Untitled thread"}</p>
                <p className="text-xs text-muted-foreground">{thread.userId} • {new Date(thread.$createdAt).toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Flagged Community Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {flagged.documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No flagged community activity found.</p>
            ) : flagged.documents.map((item: any) => (
              <div key={item.$id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium capitalize">{item.action || "action"}</p>
                  <Badge variant="outline">{item.status || "pending"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{item.reason || "No reason"}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
