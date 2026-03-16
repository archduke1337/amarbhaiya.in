"use client"

import { useInstructorLive } from "@/hooks/useInstructorLive"
import { ScheduleSessionDialog } from "@/components/instructor/ScheduleSessionDialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, Calendar, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function InstructorLivePage() {
  const { sessions, loading, scheduleSession } = useInstructorLive()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-black uppercase tracking-widest animate-pulse">Synchronizing Broadcasts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
            Live Nexus <Sparkles className="w-6 h-6 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg italic">Management center for your interactive <span className="text-foreground font-bold">Live Classrooms</span>.</p>
        </div>
        <ScheduleSessionDialog onSchedule={scheduleSession} />
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="border-border/50 bg-card/40 backdrop-blur overflow-hidden group hover:border-primary/50 transition-all">
            <CardContent className="p-0">
               <div className="p-8 flex flex-col lg:flex-row items-center gap-8">
                  <div className="relative shrink-0">
                     <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        <Video className="w-10 h-10" />
                     </div>
                  </div>

                  <div className="flex-1 space-y-4 w-full">
                     <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={`text-[9px] font-black uppercase ${
                                 session.status === 'live' ? 'border-red-500 text-red-500 animate-pulse' : 'border-emerald-500 text-emerald-500'
                              }`}>
                                 {session.status}
                              </Badge>
                              <h3 className="text-xl font-black">{session.title}</h3>
                           </div>
                           <p className="text-sm text-muted-foreground line-clamp-1">{session.description || "Interactive broadcast for students."}</p>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                           <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {format(new Date(session.scheduledAt), 'MMM dd, yyyy')}</span>
                           <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {format(new Date(session.scheduledAt), 'hh:mm a')}</span>
                        </div>
                     </div>

                     <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                        <div className="text-xs font-bold text-primary/80 uppercase tracking-widest">
                           Estimated Duration: <span className="text-foreground">{session.duration} Minutes</span>
                        </div>
                        <Button className="w-full md:w-auto rounded-full px-10 font-bold transition-all hover:scale-105" asChild>
                           <Link href={session.roomUrl}>
                              START SESSION <ArrowRight className="ml-2 w-4 h-4" />
                           </Link>
                        </Button>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}

        {sessions.length === 0 && (
          <div className="py-32 text-center bg-card/10 rounded-[3rem] border border-dashed border-border/50">
             <Video className="w-16 h-16 mx-auto mb-6 opacity-20" />
             <h3 className="text-2xl font-black mb-2 opacity-60">No sessions on the radar</h3>
             <p className="text-muted-foreground">Schedule your first live classroom to engage with your students in real-time.</p>
          </div>
        )}
      </div>
    </div>
  )
}

