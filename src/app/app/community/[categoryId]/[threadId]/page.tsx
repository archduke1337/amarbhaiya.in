/**
 * @fileoverview Forum thread page — thread content + replies.
 */
import { forumRepliesDb, forumThreadsDb } from "@/lib/appwrite/database"

type Props = { params: Promise<{ categoryId: string; threadId: string }> }

export default async function ForumThreadPage({ params }: Props) {
  const { categoryId, threadId } = await params
  const [thread, replies] = await Promise.all([
    forumThreadsDb.get(threadId),
    forumRepliesDb.listByThread(threadId),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">{(thread as any).title || "Thread"}</h1>
      <p className="text-muted-foreground">Category: {categoryId} | Thread: {threadId}</p>
      <article className="rounded-lg border p-4 text-sm">{(thread as any).content || "No content"}</article>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Replies</h2>
        {replies.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet.</p>
        ) : (
          replies.documents.map((reply: any) => (
            <div key={reply.$id} className="rounded-md border p-3">
              <p className="text-sm">{reply.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{reply.userId} • {new Date(reply.$createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
