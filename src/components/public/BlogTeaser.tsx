/**
 * @fileoverview BlogTeaser — shows latest blog posts or a CTA to start reading.
 * Fetches from the blog page's data when available, falls back to static content.
 */
"use client"

import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const RECENT_ARTICLES = [
  {
    title: "Career Strategy 101",
    excerpt: "A practical roadmap for long-term growth in software engineering.",
    href: "/blog",
  },
  {
    title: "How To Build Projects That Matter",
    excerpt: "Turn learning into credible portfolio outcomes that hiring managers notice.",
    href: "/blog",
  },
  {
    title: "Interview Prep System",
    excerpt: "A repeatable framework for cracking technical interviews consistently.",
    href: "/blog",
  },
]

export function BlogTeaser() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              From the Blog
            </h2>
            <p className="text-lg text-muted-foreground">
              Frameworks, mental models, and insights to accelerate your engineering career.
            </p>
          </div>
          <Button variant="outline" className="rounded-full hidden md:flex" asChild>
            <Link href="/blog">
              All Articles <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {RECENT_ARTICLES.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                href={article.href}
                className="block h-full rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-primary/30 hover:bg-card transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="rounded-full w-full" asChild>
            <Link href="/blog">All Articles <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
