/**
 * @fileoverview useEnrollment hook — check enrollment status for a course.
 */
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"

export function useEnrollment(courseId?: string) {
  const { user } = useAuth()
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!courseId || !user) {
      setIsEnrolled(false)
      return
    }

    let active = true
    const check = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/lms/courses/${courseId}/enrollment`)
        const json = await res.json()
        if (active) setIsEnrolled(json.enrolled === true)
      } catch {
        if (active) setIsEnrolled(false)
      } finally {
        if (active) setLoading(false)
      }
    }
    check()
    return () => { active = false }
  }, [courseId, user])

  return { isEnrolled, loading }
}
