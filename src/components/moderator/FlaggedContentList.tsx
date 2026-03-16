/**
 * @fileoverview FlaggedContentList — reports queue that allows moderators to process reported content.
 */
"use client"

import { useState } from "react"
import { AlertCircle, MessageSquare, ShieldAlert, CheckCircle2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { useModerationReports } from "@/hooks/useModerationReports"
import { Loader2 } from "lucide-react"

export function FlaggedContentList() {
  const { reports, setReports, loading } = useModerationReports()

  const handleAction = async (id: string, action: "dismiss" | "delete") => {
    // Optimistic UI updates
    setReports(prev => prev.filter(r => r.id !== id))
    
    // In a production system:
    // await fetch(`/api/moderation/reports/${id}`, { method: "PATCH", body: JSON.stringify({ action }) })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }


  if (reports.length === 0) {
    return (
      <Card className="border-dashed border-2 bg-transparent shadow-none border-border/50">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center h-64">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mb-4" />
          <h3 className="text-xl font-bold mb-2">Queue Empty</h3>
          <p className="text-muted-foreground">All flagged content has been reviewed. Great job!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {reports.map(report => (
        <Card key={report.id} className="border-border/50 bg-card/60 backdrop-blur shadow-sm hover:border-destructive/30 transition-colors">
          <CardHeader className="pb-3 border-b border-border/50 bg-muted/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive shrink-0">
                  {report.severity === 'critical' ? <ShieldAlert className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Reported {report.type}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium uppercase tracking-wider">
                      {report.severity}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Reported by <span className="font-mono">{report.reportedBy}</span> • {report.date}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
            <div className="flex-1">
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50 relative">
                <MessageSquare className="w-4 h-4 absolute top-4 left-4 text-muted-foreground" />
                <p className="text-foreground text-sm pl-8 italic">&quot;{report.content}&quot;</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-2">Author: {report.author}</p>
            </div>
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
              <Button onClick={() => handleAction(report.id, "delete")} variant="destructive" size="sm" className="w-full justify-start gap-2">
                <Trash2 className="w-4 h-4" /> Delete Content
              </Button>
              <Button onClick={() => handleAction(report.id, "dismiss")} variant="outline" size="sm" className="w-full justify-start gap-2">
                <CheckCircle2 className="w-4 h-4" /> Dismiss Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
