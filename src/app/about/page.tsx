/**
 * @fileoverview About page — Amarnath's story, mission, values.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Amarnath Bhaiya — a mentor who builds systems that guide students from confusion to clarity and real career outcomes.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">About Amarnath Bhaiya</h1>
        <p className="text-muted-foreground text-lg">
          A mentor who builds systems that guide students from confusion → clarity → outcomes.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <section className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Build a predictable path for students to move from uncertainty to real outcomes.
            </p>
          </section>
          <section className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Approach</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Systems-first mentorship with clear milestones, accountability, and execution support.
            </p>
          </section>
          <section className="rounded-lg border p-5">
            <h2 className="text-lg font-semibold">Outcome</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Better decisions, stronger portfolios, and measurable career progress.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
