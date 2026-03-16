/**
 * @fileoverview useInstructorStats hook — fetch metrics for the instructor panel.
 */
"use client"
import { useState, useEffect, useCallback } from "react"

export type InstructorStats = {
  totalStudents: number
  totalRevenue: number
  activeCourses: number
  avgRating: number
}

export type CoursePerf = {
  id: string
  title: string
  students: number
  revenue: number
  thumbnail: string | null
}

export type RecentEnrollment = {
  id: string
  studentName: string
  studentEmail?: string
  courseTitle: string
  enrolledAt: string
}

export function useInstructorStats() {
  const [stats, setStats] = useState<InstructorStats | null>(null)
  const [performance, setPerformance] = useState<CoursePerf[]>([])
  const [enrollments, setEnrollments] = useState<RecentEnrollment[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/instructor/stats")
      const json = await res.json()
      if (res.ok) {
        setStats(json.stats)
        setPerformance(json.coursePerformance || [])
        setEnrollments(json.recentEnrollments || [])
      }
    } catch (err) {
      console.error("Fetch instructor stats error", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { stats, performance, enrollments, loading, refresh: loadData }
}
