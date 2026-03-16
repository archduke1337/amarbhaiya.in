/**
 * @fileoverview Student course player — course overview, redirects to first lesson or shows syllabus.
 */
"use client"

import { useCourse } from "@/hooks/useCourse"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function CoursePlayerPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { course, loading } = useCourse(id)

  // Redirect to first lesson automatically if available
  useEffect(() => {
    if (!loading && course) {
      const firstModule = (course as any).modules?.[0]
      const firstLesson = firstModule?.lessons?.[0]
      
      if (firstLesson) {
        router.replace(`/app/courses/${id}/${firstLesson.$id}`)
      }
    }
  }, [loading, course, id, router])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <h2>Course not found.</h2>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-2xl">
        <CardHeader className="text-center pb-8 border-b border-border/10">
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-2">
            {course.title}
          </CardTitle>
          <CardDescription className="text-lg pb-4">
            {course.tagline || "Prepare for your learning journey."}
          </CardDescription>
          <div className="flex justify-center">
            {/* Fallback button if auto-redirect fails or user goes back */}
            <Button size="lg" className="rounded-full px-8 shadow-primary/25 shadow-lg gap-2">
              <Play className="w-5 h-5 fill-current" /> Auto-playing next lesson...
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-8 prose dark:prose-invert max-w-none">
          <h3>Course Overview</h3>
          <p className="text-muted-foreground leading-relaxed">
            {course.description || "Welcome to the course! Select a lesson from the sidebar to begin."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
