/**
 * @fileoverview LessonComments — displays and posts comments specifically for a lesson.
 */
"use client"

import { useEffect, useState } from "react"
import { Send, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

export function LessonComments({ lessonId }: { lessonId: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState("")

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/lms/lessons/${lessonId}/comments`)
      const data = await res.json()
      if (res.ok) setComments(data.comments)
    } catch (error) {
      console.error("Failed to fetch comments", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [lessonId])

  const postComment = async () => {
    if (!body.trim()) return
    try {
      const res = await fetch(`/api/lms/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: body }),
      })
      if (res.ok) {
        setBody("")
        fetchComments()
        toast.success("Comment posted")
      }
    } catch {
      toast.error("Error posting comment")
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-4">
        <h3 className="text-xl font-black">Comments ({comments.length})</h3>
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">ME</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea 
              placeholder="Questions or feedback about this lesson?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20"
            />
            <div className="flex justify-end">
              <Button onClick={postComment} size="sm" className="rounded-full px-6 font-bold">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.$id} className="flex gap-4 group">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarFallback className="text-xs font-black bg-muted/50">{c.authorName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{c.authorName || "Anonymous"}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{formatDistanceToNow(new Date(c.$createdAt))} ago</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && !loading && (
          <div className="text-center py-12 border-2 border-dashed rounded-3xl opacity-20 italic text-sm">
            Be the first to comment on this lesson!
          </div>
        )}
      </div>
    </div>
  )
}
