/**
 * @fileoverview InstructorStatsCards — visual highlight of key metrics.
 */
"use client"

import { Users, IndianRupee, BookOpen, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InstructorStats } from "@/hooks/useInstructorStats"

export function InstructorStatsCards({ stats }: { stats: InstructorStats }) {
  const cards = [
    { 
      title: "Total Revenue", 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: IndianRupee, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      trend: "+12.5%"
    },
    { 
      title: "Total Students", 
      value: stats.totalStudents.toLocaleString(), 
      icon: Users, 
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+5.2%"
    },
    { 
      title: "Active Courses", 
      value: stats.activeCourses.toString(), 
      icon: BookOpen, 
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "Stable"
    },
    { 
      title: "Avg. Rating", 
      value: stats.avgRating.toFixed(1), 
      icon: Star, 
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Top 5%"
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50 bg-card/40 backdrop-blur hover:bg-card/60 transition-all border-b-4 border-b-transparent hover:border-b-primary/50 group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">{card.value}</div>
            <p className="text-xs font-bold flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              {card.trend} <span className="opacity-50 font-medium">this month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
