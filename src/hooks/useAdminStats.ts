/**
 * @fileoverview useAdminStats hook — fetch platform metrics for admin panel.
 */
"use client"
import { useState, useEffect } from "react"

export type AdminStats = {
  totalRevenue: number
  totalUsers: number
  activeCourses: number
  systemAlerts: number
}

export type RecentActivity = {
  type: string
  title: string
  subtitle: string
  time: string
}

export type CourseRevenue = {
  id: string
  title: string
  revenue: number
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [activity, setActivity] = useState<RecentActivity[]>([])
  const [revenueByCourse, setRevenueByCourse] = useState<CourseRevenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadStats = async () => {
      try {
        const res = await fetch("/api/admin/stats")
        const json = await res.json()
        if (active && res.ok) {
          setStats(json.stats)
          setActivity(json.recentActivity || [])
          setRevenueByCourse(json.revenueByCourse || [])
        }
      } catch (err) {
        console.error("Fetch admin stats error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadStats()
    return () => { active = false }
  }, [])

  return { stats, activity, revenueByCourse, loading }
}

