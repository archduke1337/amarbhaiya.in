/**
 * @fileoverview Forum thread page — thread content + replies.
 */
type Props = { params: Promise<{ categoryId: string; threadId: string }> }

export default async function ForumThreadPage({ params }: Props) {
  const { categoryId, threadId } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Thread</h1>
      <p className="text-muted-foreground">Category: {categoryId} | Thread: {threadId}</p>
      {/* TODO: ForumThread, ForumReply list, ReplyForm */}
    </div>
  )
}
