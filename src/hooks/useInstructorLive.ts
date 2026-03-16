/**
 * @fileoverview useInstructorLive hook — management for instructor sessions.
 */
"use client"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export function useInstructorLive() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/instructor/live")
      const json = await res.json()
      if (res.ok) {
        setSessions(json.sessions)
      }
    } catch (err) {
      console.error("Failed to load sessions", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleSession = async (data: { title: string, description: string, scheduledAt: string, duration: number }) => {
    try {
      const res = await fetch("/api/instructor/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success("Live session scheduled successfully!")
        loadSessions()
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to schedule session")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return { sessions, loading, scheduleSession, refresh: loadSessions }
}
