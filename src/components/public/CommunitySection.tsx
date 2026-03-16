/**
 * @fileoverview CommunitySection — Social proof showcasing forum activity and student collaboration.
 */
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Users2, Heart, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ForumActivity = {
  author: string
  topic: string
  time: string
  likes: number
  replies: number
}

type CommunityStats = {
  dailyActiveUsers: number
  knowledgeContributions: number
}

export function CommunitySection() {
  const [forumActivity, setForumActivity] = useState<ForumActivity[]>([])
  const [stats, setStats] = useState<CommunityStats>({ dailyActiveUsers: 0, knowledgeContributions: 0 })

  useEffect(() => {
    fetch("/api/public/community")
      .then((res) => res.json())
      .then((data) => {
        setForumActivity(data.activity || [])
        if (data.stats) setStats(data.stats)
      })
      .catch(() => {})
  }, [])

  if (forumActivity.length === 0) return null

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          <div className="flex-1 space-y-8 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              A <span className="text-primary italic">Neighborhood</span> of Elite Engineers.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Don't learn in a vacuum. Join our exclusive forums where engineers from top-tier companies share blueprints, debate trade-offs, and celebrate wins.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4">
               <div>
                  <p className="text-3xl font-black mb-1">{stats.dailyActiveUsers}+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Active Users</p>
               </div>
               <div>
                  <p className="text-3xl font-black mb-1">{stats.knowledgeContributions}+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Knowledge Contributions</p>
               </div>
            </div>

            <Button size="lg" className="rounded-full px-10 font-black shadow-2xl shadow-primary/30" asChild>
               <Link href="/community">ENTER THE FORUM</Link>
            </Button>
          </div>

          <div className="flex-1 w-full relative">
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 opacity-30" />
             
             <div className="space-y-4 relative z-10">
                {forumActivity.map((post, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className={`p-6 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl hover:border-primary/50 transition-all cursor-default ${i === 1 ? 'ml-8' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold">
                             {post.author.charAt(0)}
                          </div>
                          <span className="text-sm font-black">{post.author}</span>
                       </div>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase">{post.time}</span>
                    </div>
                    <h4 className="font-bold text-foreground mb-4 line-clamp-1">{post.topic}</h4>
                    <div className="flex items-center gap-6 text-muted-foreground">
                       <span className="flex items-center gap-1.5 text-xs font-bold"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>
                       <span className="flex items-center gap-1.5 text-xs font-bold"><MessageSquare className="w-3.5 h-3.5" /> {post.replies}</span>
                       <Share2 className="w-3.5 h-3.5 ml-auto opacity-40" />
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
