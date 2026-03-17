/**
 * @fileoverview CourseCatalogue — Filterable, paginated list of all published courses.
 * Debounced search to avoid firing API calls on every keystroke.
 */
"use client"
import { useCourses } from "@/hooks/useCourses"
import { CourseCard } from "./CourseCard"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"

export function CourseCatalogue() {
  const [inputValue, setInputValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const debounceRef = useRef<NodeJS.Timeout>(null)

  // Debounce search input (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(inputValue)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputValue])

  const { courses, loading } = useCourses({ search: debouncedSearch })

  return (
    <div className="space-y-8">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search our curriculum..."
            className="pl-10 bg-card/50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          Showing <span className="text-foreground font-bold">{courses.length}</span> results
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading courses…</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="py-20 text-center border border-dashed rounded-3xl bg-muted/5">
          <p className="text-muted-foreground text-lg">No courses found matching your search.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.$id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
