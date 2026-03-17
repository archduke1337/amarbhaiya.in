/**
 * @fileoverview useModerationReports hook.
 */
"use client"
import { useState, useEffect, useCallback } from "react"

export function useModerationReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/moderation/reports")
      const json = await res.json()
      if (res.ok) {
        setReports(json.reports ?? [])
      }
    } catch (err) {
      console.error("Fetch moderation reports error", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/moderation/reports")
        const json = await res.json()
        if (active && res.ok) {
          setReports(json.reports ?? [])
        }
      } catch (err) {
        console.error("Fetch moderation reports error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [])

  return { reports, setReports, loading, refresh: loadReports }
}
