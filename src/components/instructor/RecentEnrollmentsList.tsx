/**
 * @fileoverview RecentEnrollmentsList — real-time student activity feed.
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { RecentEnrollment } from "@/hooks/useInstructorStats"
import { UserPlus, ChevronRight } from "lucide-react"

export function RecentEnrollmentsList({ enrollments }: { enrollments: RecentEnrollment[] }) {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary" /> Recent Students
        </CardTitle>
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-2 py-1 rounded">Live Feed</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/20">
          {enrollments.map((en) => (
            <div key={en.id} className="flex items-center justify-between p-4 hover:bg-primary/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold text-xs">
                    {en.studentName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{en.studentName}</p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                    Enrolled in <span className="text-foreground/80">{en.courseTitle}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-black text-muted-foreground opacity-50">
                  {formatDistanceToNow(new Date(en.enrolledAt))} ago
                </p>
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
          {enrollments.length === 0 && (
            <div className="py-12 text-center text-muted-foreground italic text-sm">
              Waiting for your first student...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
