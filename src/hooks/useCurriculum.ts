/**
 * @fileoverview useCurriculum hook — manage course modules and lessons.
 */
"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"

export function useCurriculum(courseId: string) {
  const [modules, setModules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCurriculum = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/lms/courses/${courseId}`)
      const data = await res.json()
      if (res.ok) {
        setModules(data.course.modules || [])
      }
    } catch (error) {
      console.error("Failed to fetch curriculum", error)
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => {
    fetchCurriculum()
  }, [fetchCurriculum])

  const addModule = async (title: string) => {
    try {
      const res = await fetch("/api/instructor/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, title, order: modules.length }),
      })
      if (res.ok) {
        toast.success("Module added")
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to add module")
    }
  }

  const updateModule = async (moduleId: string, updates: any) => {
    try {
      const res = await fetch(`/api/instructor/modules/${moduleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to update module")
    }
  }

  const deleteModule = async (moduleId: string) => {
    try {
      const res = await fetch(`/api/instructor/modules/${moduleId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Module deleted")
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to delete module")
    }
  }

  const addLesson = async (moduleId: string, title: string) => {
    try {
      const module = modules.find(m => m.$id === moduleId)
      const res = await fetch("/api/instructor/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          courseId, 
          moduleId, 
          title, 
          order: module?.lessons?.length || 0 
        }),
      })
      if (res.ok) {
        toast.success("Lesson added")
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to add lesson")
    }
  }

  const updateLesson = async (lessonId: string, updates: any) => {
    try {
      const res = await fetch(`/api/instructor/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to update lesson")
    }
  }

  const deleteLesson = async (lessonId: string) => {
    try {
      const res = await fetch(`/api/instructor/lessons/${lessonId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Lesson deleted")
        fetchCurriculum()
      }
    } catch (error) {
      toast.error("Failed to delete lesson")
    }
  }

  return {
    modules,
    loading,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
    refresh: fetchCurriculum,
  }
}
