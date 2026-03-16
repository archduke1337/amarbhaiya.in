/**
 * @fileoverview Student Progress Report — detailed breakdown of learning metrics.
 */
"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle2, Clock, Trophy, ChevronRight, BarChart3, Loader2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function ProgressReportPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch("/api/lms/progress/report")
        if (res.ok) {
          const data = await res.json()
          setReport(data)
        }
      } catch (err) {
        console.error("Failed to fetch report", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground animate-pulse">Generating Report...</p>
      </div>
    )
  }

  if (!report || report.courses.length === 0) {
    return (
      <div className="text-center py-20 bg-card/20 rounded-[2rem] border border-dashed border-border/50">
        <BarChart3 className="w-16 h-16 mx-auto mb-6 opacity-20" />
        <h2 className="text-2xl font-black mb-4">No progress detected</h2>
        <p className="text-muted-foreground mb-8">Enroll in a course to start tracking your academic growth.</p>
        <Button asChild className="rounded-full px-8">
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Progress Analytics</h1>
          <p className="text-muted-foreground text-lg italic">Comprehensive evaluation for <span className="text-foreground font-bold">{report.studentName}</span></p>
        </div>
        <div className="flex items-center gap-4 bg-primary/5 px-6 py-4 rounded-3xl border border-primary/20">
           <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Overall Academic Standing</p>
              <p className="text-2xl font-black">{Math.round(report.overallProgress)}% Complete</p>
           </div>
           <div className="w-16 h-16 rounded-full border-4 border-primary border-t-emerald-500 animate-spin-slow flex items-center justify-center">
              <SparkleIcon />
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {report.courses.map((course: any) => (
          <Card key={course.courseId} className="border-border/50 bg-card/40 backdrop-blur overflow-hidden group hover:border-primary/50 transition-all">
            <CardContent className="p-0">
              <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8">
                {/* Visual indicator */}
                <div className="relative shrink-0">
                   <div className="w-24 h-24 rounded-[2rem] bg-muted/20 flex items-center justify-center text-primary border border-border/50">
                      <BookOpen className="w-10 h-10 opacity-40" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center text-white">
                      <CheckCircle2 className="w-5 h-5" />
                   </div>
                </div>

                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                   <div>
                      <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-muted-foreground uppercase opacity-60">
                         <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last active {formatDistanceToNow(new Date(course.lastActivity))} ago</span>
                         <span>•</span>
                         <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" /> {course.completedLessons} / {course.totalLessons} Lessons</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{course.percent}% Transpired</span>
                        <span className="text-muted-foreground">{course.totalLessons - course.completedLessons} Pending</span>
                      </div>
                      <Progress value={course.percent} className="h-2.5 bg-primary/5" />
                   </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                   <Button variant="outline" className="w-full md:w-auto rounded-full px-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                      <Link href={`/app/courses/${course.courseId}`}>
                        RESUME <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                   </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
       <path d="M12 2L14.4 7.2L20 8L16 12L17.2 17.6L12 15L6.8 17.6L8 12L4 8L9.6 7.2L12 2Z" fill="currentColor" />
    </svg>
  )
}
