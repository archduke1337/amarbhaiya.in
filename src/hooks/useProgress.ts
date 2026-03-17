/**
 * @fileoverview useProgress hook — lesson completion tracking synced with Appwrite DB.
 */
"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"

type ProgressState = {
  completed: Record<string, string[]>
  lastLessonId?: string
}

const STORAGE_KEY = "amarbhaiya-progress-v2"

export function useProgress(courseId?: string) {
  const { user } = useAuth()
  const [state, setState] = useState<ProgressState>({ completed: {} })
  const [isLoaded, setIsLoaded] = useState(false)

  const storageKey = user ? `${STORAGE_KEY}-${user.$id}` : STORAGE_KEY

  // 1. Initial Load & Multi-User Migration
  useEffect(() => {
    try {
      // Always try to load the current storageKey
      const raw = localStorage.getItem(storageKey)
      let currentProgress: ProgressState = raw ? JSON.parse(raw) : { completed: {} }

      // If we just logged in, check for legacy unauthenticated progress to migrate
      if (user) {
        const legacyRaw = localStorage.getItem(STORAGE_KEY)
        if (legacyRaw) {
          const legacyProgress: ProgressState = JSON.parse(legacyRaw)
          // Merge legacy into current
          Object.entries(legacyProgress.completed).forEach(([cId, lessons]) => {
            const existing = new Set(currentProgress.completed[cId] ?? [])
            lessons.forEach(l => existing.add(l))
            currentProgress.completed[cId] = Array.from(existing)
          })
          if (legacyProgress.lastLessonId) currentProgress.lastLessonId = legacyProgress.lastLessonId

          // Save merged and clear legacy
          localStorage.setItem(storageKey, JSON.stringify(currentProgress))
          localStorage.removeItem(STORAGE_KEY)
        }
      }

      setState(currentProgress)
    } catch { /* empty */ } finally {
      // Mark as loaded after localStorage is read — regardless of auth state
      setIsLoaded(true)
    }
  }, [user, storageKey])

  // 2. Sync with backend if logged in and specific course passed
  useEffect(() => {
    if (!user || !courseId) return

    async function fetchProgress() {
      try {
        const res = await fetch(`/api/lms/courses/${courseId}/progress`)
        if (res.ok) {
          const data = await res.json()
          setState((prev) => {
            const newState = {
              ...prev,
              completed: { ...prev.completed, [courseId as string]: data.completed },
            }
            localStorage.setItem(storageKey, JSON.stringify(newState))
            return newState
          })
        }
      } catch (err) {
        console.error("Failed to fetch progress", err)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchProgress()
  }, [user, courseId, storageKey])

  const markComplete = useCallback(async (cId: string, lessonId: string) => {
    // Optimistic UI update
    setState((prev) => {
      const existing = new Set(prev.completed[cId] ?? [])
      existing.add(lessonId)
      const newState = { ...prev, completed: { ...prev.completed, [cId]: Array.from(existing) }, lastLessonId: lessonId }
      localStorage.setItem(storageKey, JSON.stringify(newState))
      return newState
    })

    // If logged in, sync to backend
    if (user) {
      try {
        await fetch(`/api/lms/courses/${cId}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId }),
        })
      } catch (err) {
        console.error("Failed to sync progress to backend", err)
      }
    }
  }, [user, storageKey])

  const isCompleted = useCallback((cId: string, lessonId: string) => {
    return state.completed[cId]?.includes(lessonId) ?? false
  }, [state])

  const getCourseProgress = useCallback((cId: string, totalLessons: number) => {
    const done = state.completed[cId]?.length ?? 0
    return { completed: done, total: totalLessons, percent: totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100) }
  }, [state])

  return { completedLessons: state.completed, lastLessonId: state.lastLessonId, markComplete, isCompleted, getCourseProgress, isLoaded }
}
