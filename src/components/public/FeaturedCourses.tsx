"use client"

import { useCourses } from "@/hooks/useCourses"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Star, Clock, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FeaturedCourses() {
  const { courses, loading } = useCourses({ limit: 2 })

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (courses.length === 0) return null

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Premium Flagship Courses
            </h2>
            <p className="text-lg text-muted-foreground">
              Intensive, highly structured curriculums designed to push you to the next stage of your engineering career.
            </p>
          </div>
          <Button variant="outline" className="rounded-full hidden md:flex" asChild>
            <Link href="/courses">View All Courses <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {courses.map((course, i) => (
            <motion.div
              key={course.$id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group flex flex-col bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Image Banner */}
              <div className="relative h-64 overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                {course.thumbnailUrl ? (
                   <img 
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-violet-500/20" />
                )}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur text-foreground font-semibold">
                    {course.level || "Intermediate"}
                  </Badge>
                </div>
              </div>

              {/* Course Detail Body */}
              <div className="p-8 flex-1 flex flex-col justify-between relative bg-card/80 backdrop-blur-sm z-20">
                <div>
                  {course.rating && Number(course.rating) > 0 && (
                    <div className="flex items-center gap-1 text-yellow-500 mb-3 text-sm font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed text-sm">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6 text-sm text-foreground/80 font-medium border-y border-border/50 py-4">
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /> {course.duration || "Self-paced"}</span>
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-muted-foreground" /> {course.lessonsCount || 0} Lessons</span>
                  </div>

                  <Button className="w-full text-base h-12 shadow-lg shadow-primary/20" asChild>
                    <Link href={`/courses/${course.slug ?? course.$id}`}>Explore Curriculum</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="rounded-full w-full" asChild>
            <Link href="/courses">View All Courses <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
