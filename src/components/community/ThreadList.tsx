/**
 * @fileoverview ThreadList — displays all discussion threads in a category.
 */
"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Clock, User, ChevronRight, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

export function ThreadList({ categoryId }: { categoryId: string }) {
  const [data, setData] = useState<{ category: any, threads: any[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch(`/api/community/categories/${categoryId}/threads`)
        const result = await res.json()
        if (res.ok) setData(result)
      } catch (error) {
        console.error("Failed to fetch threads", error)
      } finally {
        setLoading(false)
      }
    }
    fetchThreads()
  }, [categoryId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!data || data.threads.length === 0) {
    return (
      <Card className="border-dashed border-2 py-20 text-center text-muted-foreground bg-transparent">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-10" />
        <p className="text-lg font-medium mb-6">No discussions yet in {data?.category?.name || "this category"}.</p>
        <Button className="rounded-full px-8 shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Start the First Discussion
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h2 className="text-2xl font-black">{data.category.name}</h2>
           <p className="text-muted-foreground">{data.threads.length} Disussions</p>
        </div>
        <Button className="rounded-full shadow-lg shadow-primary/20 gap-2">
           <Plus className="w-5 h-5" /> New Post
        </Button>
      </div>

      <div className="bg-card/30 backdrop-blur rounded-3xl border border-border/50 overflow-hidden">
        {data.threads.map((thread, index) => (
          <Link key={thread.$id} href={`/app/community/thread/${thread.$id}`}>
            <div className={`p-5 flex items-center justify-between group hover:bg-primary/[0.03] transition-all ${
              index !== data.threads.length - 1 ? 'border-b border-border/10' : ''
            }`}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                   <User className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                   <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">{thread.title}</h4>
                   <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1 font-medium">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {thread.authorName || "Anonymous"}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(thread.$createdAt))} ago</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="text-center hidden sm:block">
                    <p className="font-black text-sm">{thread.replyCount || 0}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Replies</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
