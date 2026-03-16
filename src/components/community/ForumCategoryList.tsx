/**
 * @fileoverview ForumCategoryList — displays a list of discussion categories.
 */
"use client"

import { useEffect, useState } from "react"
import { MessageSquare, TrendingUp, Users, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function ForumCategoryList() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/community/categories")
        const data = await res.json()
        if (res.ok) setCategories(data.categories)
      } catch (error) {
        console.error("Failed to fetch categories", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <Card className="border-dashed border-2 py-12 text-center text-muted-foreground">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p>No discussion categories found. Start one to build the community!</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 animate-in fade-in duration-700">
      {categories.map((cat) => (
        <Link key={cat.$id} href={`/app/community/${cat.$id}`}>
          <Card className="group border-border/50 bg-card/40 backdrop-blur hover:bg-primary/[0.02] transition-all hover:shadow-xl hover:-translate-y-1">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-muted-foreground line-clamp-1 max-w-xl">{cat.description || "Join the conversation on this topic."}</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-right hidden md:flex">
                <div className="space-y-1">
                  <p className="text-sm font-black flex items-center gap-2 justify-end">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> {cat.threadCount || 0}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Threads</p>
                </div>
                <div className="space-y-1 border-l border-border/50 pl-8">
                  <p className="text-sm font-black flex items-center gap-2 justify-end">
                    <Users className="w-4 h-4 text-blue-500" /> {cat.membersCount || 24}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active</p>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
