/**
 * @fileoverview About page — Amarnath's story, mission, values.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">About Amarnath Bhaiya</h1>
        <p className="text-muted-foreground text-lg">
          A mentor who builds systems that guide students from confusion → clarity → outcomes.
        </p>
        {/* TODO: Add full about content */}
      </main>
      <Footer />
    </>
  )
}
