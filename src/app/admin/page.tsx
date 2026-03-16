"use client"

import { useAdminStats } from "@/hooks/useAdminStats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, BookOpen, AlertTriangle, Loader2 } from "lucide-react"
import { RevenueBreakdown } from "@/components/admin/RevenueBreakdown"

export default function AdminDashboardPage() {
  const { stats, activity, revenueByCourse, loading } = useAdminStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground text-primary" />
      </div>
    )
  }

  const revenue = stats?.totalRevenue ?? 0


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and key metrics.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() ?? "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">Platform aggregate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeCourses || "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">Catalog items</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.systemAlerts || "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending moderation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <div className="md:col-span-4">
          <RevenueBreakdown data={revenueByCourse} />
        </div>

        {/* Recent Activity */}
        <Card className="md:col-span-3 bg-card/50 backdrop-blur border-border/50 shadow-sm self-start">
          <CardHeader>
            <CardTitle className="text-xl font-black">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.length === 0 ? (
               <div className="py-20 text-center text-muted-foreground">
                 No recent activity recorded.
               </div>
            ) : (
              activity.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-border/50 pb-3 last:border-0 last:pb-0 animate-in fade-in slide-in-from-right-2" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{item.type}</p>
                    <span className="text-[10px] uppercase font-bold text-primary/50">
                      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{item.title}</span>
                    <span className="text-xs text-muted-foreground/60">{new Date(item.time).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
