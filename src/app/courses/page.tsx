/**
 * @fileoverview Public course catalogue — filterable grid of published courses.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">Courses</h1>
        <p className="text-muted-foreground mb-8">Browse our complete course catalogue.</p>
        {/* TODO: CourseCatalogue component */}
      </main>
      <Footer />
    </>
  )
}
