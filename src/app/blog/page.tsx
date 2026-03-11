/**
 * @fileoverview Blog listing — all published articles.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <p className="text-muted-foreground">Articles, guides, and insights.</p>
        {/* TODO: Blog grid */}
      </main>
      <Footer />
    </>
  )
}
