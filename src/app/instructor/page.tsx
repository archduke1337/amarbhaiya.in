"use client"

import { useInstructorStats } from "@/hooks/useInstructorStats"
import { InstructorStatsCards } from "@/components/instructor/InstructorStatsCards"
import { CoursePerformanceList } from "@/components/instructor/CoursePerformanceList"
import { RecentEnrollmentsList } from "@/components/instructor/RecentEnrollmentsList"
import { Loader2, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function InstructorDashboardPage() {
  const { stats, performance, enrollments, loading } = useInstructorStats()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest animate-pulse">Synchronizing Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Creative Hub <Sparkles className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg">Your performance highlights and student interactions across <span className="text-foreground font-bold">{stats?.activeCourses} Courses</span>.</p>
        </div>
        <Link href="/instructor/courses">
          <Button className="rounded-full px-8 font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Plus className="w-5 h-5 mr-2" /> CREATE NEW COURSE
          </Button>
        </Link>
      </div>

      {stats && <InstructorStatsCards stats={stats} />}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CoursePerformanceList performance={performance} />
        </div>
        <div>
          <RecentEnrollmentsList enrollments={enrollments} />
        </div>
      </div>
      
      {/* Future roadmap hint */}
      <div className="p-8 rounded-[2rem] border border-dashed border-primary/20 bg-primary/5 text-center">
         <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-1">AI Recommendation</p>
         <p className="text-sm text-foreground/80">"Your course <span className="font-black">Modern UI Foundations</span> is trending. Consider adding a live workshop to boost revenue."</p>
      </div>
    </div>
  )
}
