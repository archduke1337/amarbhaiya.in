/**
 * @fileoverview useForums hook — forum threads, replies, categories.
 */
"use client"

import { useState, useEffect } from "react"
import type { ForumThread, ForumCategory } from "@/types/community"

export function useForumCategories() {
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch("/api/lms/community/categories")
        const json = await res.json()
        if (active) setCategories(json.categories ?? [])
      } catch { /* empty */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  return { categories, loading }
}

export function useForumThreads(categoryId?: string) {
  const [threads, setThreads] = useState<ForumThread[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categoryId) return
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/lms/community/${categoryId}/threads`)
        const json = await res.json()
        if (active) setThreads(json.threads ?? [])
      } catch { /* empty */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [categoryId])

  return { threads, loading }
}
