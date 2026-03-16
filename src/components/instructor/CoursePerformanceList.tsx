/**
 * @fileoverview CoursePerformanceList — visual ranking of best selling courses.
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CoursePerf } from "@/hooks/useInstructorStats"
import { Trophy, Users, IndianRupee, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function CoursePerformanceList({ performance }: { performance: CoursePerf[] }) {
  const maxRevenue = Math.max(...performance.map(p => p.revenue), 1)

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Course Rankings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {performance.sort((a,b) => b.revenue - a.revenue).map((course, index) => (
          <div key={course.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                  index === 0 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {index + 1}
                </span>
                <p className="font-bold text-sm truncate max-w-[200px]">{course.title}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-black">
                <div className="flex items-center gap-1 text-blue-500">
                  <Users className="w-3 h-3" /> {course.students}
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <IndianRupee className="w-3 h-3" /> {course.revenue.toLocaleString()}
                </div>
              </div>
            </div>
            <Progress value={(course.revenue / maxRevenue) * 100} className="h-1.5 bg-primary/5" />
          </div>
        ))}
        {performance.length === 0 && (
          <div className="py-10 text-center text-muted-foreground opacity-40">
            No active performance data found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
