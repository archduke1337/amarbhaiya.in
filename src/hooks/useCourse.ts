/**
 * @fileoverview useCourse hook — fetch course data, modules, lessons.
 */
"use client"

import { useEffect, useState } from "react"
import type { Course } from "@/types/course"

export function useCourse(courseId?: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) return
    let active = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/lms/courses/${courseId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load course")
        if (active) setCourse(json.course)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load course")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [courseId])

  return { course, loading, error }
}

export function useCourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/lms/courses")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to load courses")
        if (active) setCourses(json.courses ?? [])
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load courses")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return { courses, loading, error }
}
