/**
 * @fileoverview ModerationActivityFeed — audit log of recent moderator actions.
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { ModActivity } from "@/hooks/useModerationStats"
import { History, Shield, AlertTriangle, ShieldCheck } from "lucide-react"

export function ModerationActivityFeed({ activity }: { activity: ModActivity[] }) {
  const getIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'flag': return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case 'resolve': return <ShieldCheck className="w-4 h-4 text-emerald-500" />
      case 'suspend': return <Shield className="w-4 h-4 text-destructive" />
      default: return <Shield className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/20">
          {activity.map((a) => (
            <div key={a.id} className="p-4 flex items-start gap-4 hover:bg-muted/10 transition-colors group">
              <div className="mt-1 p-2 rounded-lg bg-card border border-border/50 group-hover:bg-primary/5 transition-colors">
                {getIcon(a.action)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold capitalize">{a.action} {a.target}</p>
                  <span className="text-[10px] font-black uppercase text-muted-foreground opacity-40">
                    {formatDistanceToNow(new Date(a.timestamp))} ago
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter line-clamp-1">
                  Reason: <span className="text-foreground/80">{a.reason || "System automation"}</span>
                </p>
                <div className="flex items-center gap-2 mt-2">
                   <Badge variant="outline" className={`text-[9px] h-4 font-black ${
                     a.status === 'pending' ? 'border-amber-500/50 text-amber-500' : 'border-emerald-500/50 text-emerald-500'
                   }`}>
                     {a.status.toUpperCase()}
                   </Badge>
                </div>
              </div>
            </div>
          ))}
          {activity.length === 0 && (
            <div className="py-12 text-center text-muted-foreground italic text-sm opacity-40">
              No recent moderation actions recorded.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
