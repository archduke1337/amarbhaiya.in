/**
 * @fileoverview usePublicStats hook.
 */
"use client"
import { useState, useEffect } from "react"

export function usePublicStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const loadStats = async () => {
      try {
        const res = await fetch("/api/public/stats")
        const json = await res.json()
        if (active && res.ok) {
          setStats(json)
        }
      } catch (err) {
        console.error("Fetch public stats error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadStats()
    return () => { active = false }
  }, [])

  return { stats, loading }
}
