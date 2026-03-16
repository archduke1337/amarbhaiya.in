/**
 * @fileoverview useDashboard hook — fetch student dashboard data.
 */
"use client"
import { useState, useEffect } from "react"

type DashboardData = {
  stats: {
    enrolledCourses: number
    completedHours: number
    certificatesEarned: number
  }
  activeCourse: {
    id: string
    title: string
    description: string
    category: string
    progress: number
  } | null
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadData = async () => {
      try {
        const res = await fetch("/api/lms/dashboard")
        const json = await res.json()
        if (active && res.ok) {
          setData(json)
        }
      } catch (err) {
        console.error("Fetch dashboard error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [])

  return { data, loading }
}
