/**
 * @fileoverview Blog listing — shows published articles from the Appwrite blog collection.
 * When no collection exists yet, shows a coming-soon state with topic teasers.
 */
import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { FileText, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles, guides, and insights on career strategy, project-building, and interview preparation from Amarnath Bhaiya.",
  alternates: { canonical: "/blog" },
}

// These represent planned content topics — not live articles.
// Replace with DB fetch once the blog collection is created.
const PLANNED_TOPICS = [
  {
    title: "Career Strategy 101",
    excerpt:
      "A practical roadmap for long-term growth — from your first role to senior engineer and beyond.",
    category: "Career",
  },
  {
    title: "How To Build Projects That Matter",
    excerpt:
      "Projects that actually impress hiring managers vs. projects that collect dust. The framework for choosing wisely.",
    category: "Portfolio",
  },
  {
    title: "The Interview Prep System",
    excerpt:
      "A repeatable, structured framework to prepare for technical interviews without burning out.",
    category: "Interviews",
  },
  {
    title: "System Design Mental Models",
    excerpt:
      "How to break down any system design question into patterns you already know — without memorizing architectures.",
    category: "System Design",
  },
  {
    title: "From Tutorial Hell to Building Confidence",
    excerpt:
      "Why watching tutorials doesn't build skills, and the exact mindset shift that changes everything.",
    category: "Mindset",
  },
  {
    title: "The First 90 Days at a New Job",
    excerpt:
      "A tactical guide to making a strong impression and ramping up quickly in your first engineering role.",
    category: "Career",
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Deep dives, mental models, and actionable insights from the trenches of software
            engineering.
          </p>

          {/* Coming Soon Banner */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 mb-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
              Coming Soon
            </p>
            <h2 className="text-xl font-bold mb-2">
              Blog articles are being written
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The blog is under active development. Below are the topics being prepared. Sign up to
              get notified when the first articles drop.
            </p>
          </div>

          {/* Topic Teasers */}
          <div className="grid gap-4 md:grid-cols-2">
            {PLANNED_TOPICS.map((topic) => (
              <div
                key={topic.title}
                className="rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-border transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {topic.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{topic.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {topic.excerpt}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Explore courses while you wait <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
