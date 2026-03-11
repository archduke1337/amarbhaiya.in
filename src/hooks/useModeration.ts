/**
 * @fileoverview useModeration hook — moderation actions, flagged content.
 */
"use client"

import { useState, useEffect } from "react"
import type { ModerationActionRecord } from "@/types/community"

export function useModerationActions(targetUserId?: string) {
  const [actions, setActions] = useState<ModerationActionRecord[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!targetUserId) return
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/moderation/actions?userId=${targetUserId}`)
        const json = await res.json()
        if (active) setActions(json.actions ?? [])
      } catch { /* empty */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [targetUserId])

  return { actions, loading }
}

export function useFlaggedContent() {
  const [items, setItems] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch("/api/moderation/flagged")
        const json = await res.json()
        if (active) setItems(json.items ?? [])
      } catch { /* empty */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return { items, loading }
}
