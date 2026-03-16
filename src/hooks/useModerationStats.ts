/**
 * @fileoverview useModerationStats hook — real-time community monitoring data.
 */
"use client"
import { useState, useEffect, useCallback } from "react"

export type ModStats = {
  pendingReports: number
  resolvedToday: number
  totalActions: number
  avgResponseTime: string
}

export type ModActivity = {
  id: string
  action: string
  target: string
  reason: string
  status: string
  timestamp: string
}

export function useModerationStats() {
  const [stats, setStats] = useState<ModStats | null>(null)
  const [activity, setActivity] = useState<ModActivity[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/moderation/stats")
      const json = await res.json()
      if (res.ok) {
        setStats(json.stats)
        setActivity(json.recentActions || [])
      }
    } catch (err) {
      console.error("Fetch moderation stats error", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { stats, activity, loading, refresh: loadData }
}
