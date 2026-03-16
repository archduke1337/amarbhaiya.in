/**
 * @fileoverview ModeratorStatsCards — KPI visibility for community health.
 */
"use client"

import { ShieldAlert, CheckCircle2, Gavel, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModStats } from "@/hooks/useModerationStats"

export function ModeratorStatsCards({ stats }: { stats: ModStats }) {
  const cards = [
    { 
      title: "Pending Reports", 
      value: stats.pendingReports.toString(), 
      icon: ShieldAlert, 
      color: stats.pendingReports > 10 ? "text-destructive" : "text-amber-500",
      bg: stats.pendingReports > 10 ? "bg-destructive/10" : "bg-amber-500/10",
      desc: "Requires attention"
    },
    { 
      title: "Resolved Actions", 
      value: stats.resolvedToday.toString(), 
      icon: CheckCircle2, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "All time"
    },
    { 
      title: "Total Actions", 
      value: stats.totalActions.toString(), 
      icon: Gavel, 
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Enforcements taken"
    },
    { 
      title: "Avg. Response", 
      value: stats.avgResponseTime, 
      icon: Clock, 
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "Last 7 days"
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50 bg-card/40 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">{card.value}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">{card.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
