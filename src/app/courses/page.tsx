/**
 * @fileoverview Public course catalogue — filterable grid of published courses.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { CourseCatalogue } from "@/components/courses/CourseCatalogue"

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore structured roadmaps and courses to master software engineering internals. Beginner to advanced tracks available.",
  alternates: { canonical: "/courses" },
}

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Curriculum
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Master the deep internals of software engineering with our structured roadmaps.
          </p>
          <CourseCatalogue />
        </div>
      </main>
      <Footer />
    </>
  )
}
