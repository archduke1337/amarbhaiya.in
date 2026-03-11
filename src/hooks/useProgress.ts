/**
 * @fileoverview useProgress hook — lesson completion tracking.
 */
"use client"

import { useEffect, useState, useCallback } from "react"

type ProgressState = {
  completed: Record<string, string[]>
  lastLessonId?: string
}

const STORAGE_KEY = "amarbhaiya-progress-v2"

export function useProgress() {
  const [state, setState] = useState<ProgressState>({ completed: {} })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(JSON.parse(raw))
    } catch { /* empty */ }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const markComplete = useCallback((courseId: string, lessonId: string) => {
    setState((prev) => {
      const existing = new Set(prev.completed[courseId] ?? [])
      existing.add(lessonId)
      return { ...prev, completed: { ...prev.completed, [courseId]: Array.from(existing) }, lastLessonId: lessonId }
    })
  }, [])

  const isCompleted = useCallback((courseId: string, lessonId: string) => {
    return state.completed[courseId]?.includes(lessonId) ?? false
  }, [state])

  const getCourseProgress = useCallback((courseId: string, totalLessons: number) => {
    const done = state.completed[courseId]?.length ?? 0
    return { completed: done, total: totalLessons, percent: totalLessons === 0 ? 0 : Math.round((done / totalLessons) * 100) }
  }, [state])

  return { completedLessons: state.completed, lastLessonId: state.lastLessonId, markComplete, isCompleted, getCourseProgress }
}
