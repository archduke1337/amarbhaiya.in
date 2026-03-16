/**
 * @fileoverview useModeratorStudent hook.
 */
"use client"
import { useState, useEffect } from "react"

export function useModeratorStudent(userId: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    let active = true
    const loadData = async () => {
      try {
        const res = await fetch(`/api/moderator/students/${userId}`)
        const json = await res.json()
        if (active && res.ok) {
          setData(json.student)
        }
      } catch (err) {
        console.error("Fetch moderator student error", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [userId])

  return { data, loading }
}
