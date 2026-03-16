import { useModeratorStudent } from "@/hooks/useModeratorStudent"
import { Shield, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StudentDetailPanel({ userId }: { userId: string }) {
  const { data, loading } = useModeratorStudent(userId)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-card/60 backdrop-blur rounded-3xl border border-border/50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!data) return null

  const warningCount = data.history?.filter((h: any) => h.action === "warn").length || 0
  const isHealthy = warningCount === 0
  const trustScore = Math.max(0, 100 - (warningCount * 15))

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur shadow-2xl relative overflow-hidden">
      {/* Visual health indicator border top */}
      <div className={`absolute top-0 left-0 w-full h-1.5 ${isHealthy ? 'bg-emerald-500' : 'bg-destructive'}`} />

      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-muted/50 border flex items-center justify-center text-3xl font-bold shadow-inner">
              {data.name?.charAt(0)}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                {data.name} 
                {!isHealthy && <span title="Flagged Account"><ShieldAlert className="w-5 h-5 text-destructive" /></span>}
              </h2>
              <p className="text-muted-foreground font-mono text-sm">{data.email}</p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {data.labels.map((label: string) => (
                  <span key={label} className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium capitalize">{label}</span>
                ))}
                {warningCount > 0 && (
                  <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-md font-medium">{warningCount} Warning{warningCount > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-4 bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Account Trust Score</span>
                <span className={isHealthy ? "text-emerald-500" : "text-orange-500"}>
                  {trustScore}%
                </span>
              </div>
              <Progress value={trustScore} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50 text-sm">
              <div>
                <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Joined</span>
                <span className="font-medium">{new Date(data.joinedAt).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-1">Reports</span>
                <span className={`font-medium ${warningCount > 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                  {warningCount || "No"} active
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
