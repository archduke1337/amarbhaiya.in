"use client"

import { useModerationStats } from "@/hooks/useModerationStats"
import { ModeratorStatsCards } from "@/components/moderator/ModeratorStatsCards"
import { ModerationActivityFeed } from "@/components/moderator/ModerationActivityFeed"
import { ShieldCheck, Loader2, AlertCircle, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ModeratorDashboardPage() {
  const { stats, activity, loading } = useModerationStats()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest animate-pulse">Scanning Community Health...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Safety Console <ShieldCheck className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg italic">Platform integrity monitoring for <span className="text-foreground font-bold">Community & Courses</span>.</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href="/moderator/reports">
              <Button variant="outline" className="rounded-full px-6 font-black text-xs border-primary/20">
                 VIEW ALL REPORTS
              </Button>
           </Link>
           <Link href="/moderator/students">
              <Button className="rounded-full px-6 font-black text-xs shadow-xl shadow-primary/20">
                 MANAGE STUDENTS
              </Button>
           </Link>
        </div>
      </div>

      {stats && <ModeratorStatsCards stats={stats} />}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Quick Access Grid */}
           <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/moderator/reports" className="group">
                 <div className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur hover:border-primary/50 hover:bg-card/60 transition-all flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                       <AlertCircle className="w-8 h-8" />
                    </div>
                    <div>
                       <p className="text-2xl font-black mb-1">{stats?.pendingReports}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Reports</p>
                    </div>
                 </div>
              </Link>
              <Link href="/moderator/community" className="group">
                 <div className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur hover:border-primary/50 hover:bg-card/60 transition-all flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                       <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                       <p className="text-2xl font-black mb-1">Active</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Forum Health</p>
                    </div>
                 </div>
              </Link>
           </div>

           <Card className="border-border/50 bg-card/20 p-8 text-center border-dashed rounded-[2rem]">
              <p className="text-sm text-muted-foreground">Detailed health metrics for course contents are coming soon.</p>
           </Card>
        </div>

        <div>
          <ModerationActivityFeed activity={activity} />
        </div>
      </div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={className}>{children}</div>
}

