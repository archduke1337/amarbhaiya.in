/**
 * @fileoverview ThreadView — displays a single discussion thread and its replies.
 */
"use client"

import { useEffect, useState } from "react"
import { Clock, User, MessageCircle, Send, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function ThreadView({ threadId }: { threadId: string }) {
  const [data, setData] = useState<{ thread: any, replies: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchThread = async () => {
    try {
      const res = await fetch(`/api/community/threads/${threadId}/replies`)
      const result = await res.json()
      if (res.ok) setData(result)
    } catch (error) {
      console.error("Failed to fetch thread", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThread()
  }, [threadId])

  const handlePostReply = async () => {
    if (!replyBody.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/community/threads/${threadId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyBody }),
      })
      if (res.ok) {
        setReplyBody("")
        toast.success("Reply posted!")
        fetchThread()
      } else {
        toast.error("Failed to post reply")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    )
  }

  if (!data || !data.thread) return <div>Thread not found.</div>

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Original Post */}
      <Card className="border-border/50 bg-card/40 backdrop-blur shadow-2xl overflow-hidden rounded-[2rem]">
        <CardContent className="p-8">
           <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {data.thread.authorName?.[0] || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                 <p className="font-black text-foreground">{data.thread.authorName || "Anonymous"}</p>
                 <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                   <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(data.thread.$createdAt))} ago
                 </p>
              </div>
           </div>
           
           <h1 className="text-3xl font-black tracking-tight mb-4">{data.thread.title}</h1>
           <div className="prose dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed">
              {data.thread.content}
           </div>
        </CardContent>
      </Card>

      {/* Replies Title */}
      <div className="flex items-center gap-2 px-4">
         <MessageCircle className="w-5 h-5 text-primary" />
         <h3 className="font-black text-xl uppercase tracking-widest text-muted-foreground">Responses ({data.replies.length})</h3>
      </div>

      {/* Replies List */}
      <div className="space-y-4">
         {data.replies.map((reply) => (
           <div key={reply.$id} className="flex gap-4 group">
              <div className="shrink-0">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="text-xs font-bold bg-muted/50">
                    {reply.authorName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 bg-card/30 backdrop-blur border border-border/50 rounded-2xl p-4 lg:p-6 group-hover:bg-primary/[0.01] transition-all">
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-sm tracking-tight">{reply.authorName || "Anonymous"}</span>
                       {reply.isInstructor && (
                         <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" /> Instructor
                         </span>
                       )}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">
                       {formatDistanceToNow(new Date(reply.$createdAt))} ago
                    </span>
                 </div>
                 <p className="text-muted-foreground leading-relaxed">{reply.content}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Reply Input */}
      <div className="pt-8 border-t border-border/50">
         <div className="flex gap-4">
            <Avatar className="h-10 w-10 border border-border/50 hidden sm:block">
               <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
               <Textarea 
                placeholder="Share your thoughts or answer a question..."
                className="min-h-[120px] bg-card/40 border-border/50 rounded-2xl focus:ring-primary/20 resize-none text-lg p-6"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
               />
               <div className="flex justify-end">
                  <Button 
                    onClick={handlePostReply}
                    disabled={!replyBody.trim() || submitting}
                    className="rounded-full px-8 h-12 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Posting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" /> POST RESPONSE
                      </span>
                    )}
                  </Button>
               </div>
            </div>
         </div>
      </div>
      
      {/* Bottom Spacer */}
      <div className="h-12" />
    </div>
  )
}
