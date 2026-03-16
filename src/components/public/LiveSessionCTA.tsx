/**
 * @fileoverview LiveSessionCTA — Premium section highlighting real-time cohort engagement.
 */
"use client"

import { motion } from "framer-motion"
import { Video, Users, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LiveSessionCTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#020617]">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-3xl p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl">
          
          <div className="max-w-xl space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest animate-pulse">
               <Video className="w-3 h-3" /> Live Learning
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Real-world <span className="text-primary italic">Intelligence</span>, Live on Screen.
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed">
              Skip the pre-recorded fatigue. Join live system design walkthroughs, collaborative debugging, and deep-dive architecture sessions every week.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                     <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">500+ Peers Watching</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                     <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold opacity-80 uppercase tracking-tighter">Instant Q&A</span>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-[450px] space-y-4">
             <div className="p-6 rounded-[2rem] border border-white/5 bg-white/5 space-y-4 hover:border-primary/50 transition-all duration-700">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">Upcoming Tonight</p>
                   <span className="text-xs font-bold opacity-40">21:00 IST</span>
                </div>
                <h4 className="text-xl font-black">Dockerizing Legacy Java Monoliths</h4>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-muted border border-border/50" />
                   <p className="text-xs font-medium text-muted-foreground">with Amarnath Pandey</p>
                </div>
                <Button className="w-full rounded-2xl h-12 font-black shadow-primary/20 shadow-xl" asChild>
                   <Link href="/courses">RESERVE MY SPOT <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
             </div>
             
             <p className="text-center text-[10px] font-bold text-muted-foreground uppercase opacity-40">Next session: System Design Interview Blueprint (Saturday 11:00 AM)</p>
          </div>

        </div>
      </div>
    </section>
  )
}
