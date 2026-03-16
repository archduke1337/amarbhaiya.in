/**
 * @fileoverview useCourses hook — fetch list of courses with filtering.
 */
"use client"
import { useState, useEffect } from "react"

export function useCourses(params: { category?: string; search?: string; limit?: number; offset?: number } = {}) {
  const [courses, setCourses] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadCourses = async () => {
      try {
        const query = new URLSearchParams()
        if (params.category) query.set("category", params.category)
        if (params.search) query.set("search", params.search)
        if (params.limit) query.set("limit", params.limit.toString())
        if (params.offset) query.set("offset", params.offset.toString())

        const res = await fetch(`/api/lms/courses?${query.toString()}`)
        const json = await res.json()
        if (active && res.ok) {
          setCourses(json.courses)
          setTotal(json.total)
        }
      } catch (err) {
        console.error("Fetch courses error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadCourses()
    return () => { active = false }
  }, [params.category, params.search, params.limit, params.offset])

  return { courses, total, loading }
}
