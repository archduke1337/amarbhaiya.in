/**
 * @fileoverview Course store — Zustand state for course catalog + filters.
 */
import { create } from "zustand"
import type { Course } from "@/types/course"

type CourseStore = {
  courses: Course[]
  selectedCategory: string | null
  searchQuery: string
  setCourses: (courses: Course[]) => void
  setCategory: (category: string | null) => void
  setSearch: (query: string) => void
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  selectedCategory: null,
  searchQuery: "",
  setCourses: (courses) => set({ courses }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setSearch: (searchQuery) => set({ searchQuery }),
}))
