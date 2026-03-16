/**
 * @fileoverview useUpcomingSessions hook.
 */
"use client"
import { useState, useEffect } from "react"

export function useUpcomingSessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadSessions = async () => {
      try {
        const res = await fetch("/api/lms/dashboard/sessions")
        const json = await res.json()
        if (active && res.ok) {
          setSessions(json.sessions)
        }
      } catch (err) {
        console.error("Fetch upcoming sessions error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadSessions()
    return () => { active = false }
  }, [])

  return { sessions, loading }
}
