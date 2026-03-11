/**
 * @fileoverview useLiveSession hook — Stream Video/Chat live session management.
 */
"use client"

import { useState, useEffect } from "react"
import type { LiveSession } from "@/types/stream"

export function useLiveSession(sessionId?: string) {
  const [session, setSession] = useState<LiveSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/lms/live/${sessionId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error)
        if (active) setSession(json.session)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load session")
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [sessionId])

  return { session, loading, error }
}

export function useUpcomingSessions() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch("/api/lms/live")
        const json = await res.json()
        if (active) setSessions(json.sessions ?? [])
      } catch { /* empty */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return { sessions, loading }
}
