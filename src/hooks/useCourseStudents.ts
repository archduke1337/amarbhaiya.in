/**
 * @fileoverview useCourseStudents hook — fetch student list for a course.
 */
"use client"
import { useState, useEffect } from "react"

export function useCourseStudents(courseId: string) {
  const [students, setStudents] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!courseId) return
    let active = true
    const loadStudents = async () => {
      try {
        const res = await fetch(`/api/instructor/courses/${courseId}/students`)
        const json = await res.json()
        if (active && res.ok) {
          setStudents(json.students)
          setTotal(json.total)
        }
      } catch (err) {
        console.error("Fetch course students error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadStudents()
    return () => { active = false }
  }, [courseId])

  return { students, total, loading }
}
