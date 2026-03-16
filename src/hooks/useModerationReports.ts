/**
 * @fileoverview useModerationReports hook.
 */
"use client"
import { useState, useEffect } from "react"

export function useModerationReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadReports = async () => {
    try {
      const res = await fetch("/api/moderation/reports")
      const json = await res.json()
      if (res.ok) {
        setReports(json.reports)
      }
    } catch (err) {
      console.error("Fetch moderation reports error", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return { reports, setReports, loading, refresh: loadReports }
}
