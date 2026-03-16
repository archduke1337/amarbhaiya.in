/**
 * @fileoverview Student dashboard — my courses, progress overview, upcoming live sessions.
 */
"use client"

import { useAuth } from "@/hooks/useAuth"
import { useDashboard } from "@/hooks/useDashboard"
import { useUpcomingSessions } from "@/hooks/useUpcomingSessions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlayCircle, Video, BookOpen, Clock, Trophy, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading } = useDashboard()
  const { sessions, loading: sessionsLoading } = useUpcomingSessions()

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || "Student"

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back, {firstName}! 👋</h1>
          <p className="text-muted-foreground text-lg">Your academic heartbeat for <span className="text-foreground font-bold">today</span>.</p>
        </div>
        <Link href="/app/progress">
          <Button variant="outline" className="rounded-full font-black text-xs px-6 border-primary/20 hover:bg-primary/5">
            <BarChart3 className="w-4 h-4 mr-2" /> VIEW FULL REPORT
          </Button>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.enrolledCourses || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.completedHours || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.certificatesEarned || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Continue Learning */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-primary" />
            Continue Learning
          </h2>
          {data?.activeCourse ? (
            <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur shadow-sm">
              <div className="md:flex">
                <div className="md:w-1/3 bg-muted object-cover min-h-[160px] relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-blue-500/20" />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 line-clamp-1">{data.activeCourse.category}</div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{data.activeCourse.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {data.activeCourse.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{data.activeCourse.progress}%</span>
                    </div>
                    <Progress value={data.activeCourse.progress} className="h-2" />
                    <Button className="w-full sm:w-auto mt-4" size="sm" asChild>
                       <Link href={`/app/courses/${data.activeCourse.id}`}>Resume Course</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed border-2 bg-transparent shadow-none border-border/50">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center h-48">
                 <p className="text-muted-foreground mb-4">You are not actively enrolled in any courses yet.</p>
                 <Button asChild>
                   <Link href="/courses">Explore Curriculum</Link>
                 </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Upcoming Live Sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-500" />
            Upcoming Sessions
          </h2>
          
          {sessionsLoading ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur animate-pulse h-48" />
          ) : sessions.length === 0 ? (
            <Card className="border-dashed border-2 bg-transparent shadow-none border-border/50">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center h-48">
                 <p className="text-muted-foreground text-sm italic">No sessions scheduled this week.</p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="border-border/50 bg-card/50 backdrop-blur shadow-sm hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base line-clamp-1">{session.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{session.description || "Live doubt resolution"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-primary/10 rounded-md text-primary font-bold text-center min-w-[3rem] leading-tight">
                        <div className="text-[10px] uppercase font-bold">{new Date(session.scheduledAt).toLocaleDateString("en-US", { month: 'short' })}</div>
                        <div className="text-lg">{new Date(session.scheduledAt).getDate()}</div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(session.scheduledAt).toLocaleDateString("en-US", { weekday: 'long' })}, {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-muted-foreground text-xs">Duration: {session.duration} mins</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild disabled={!session.zoomLink}>
                    {session.zoomLink ? <Link href={session.zoomLink}>Join Session</Link> : <span>Coming Soon</span>}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

