/**
 * @fileoverview HeroSection component — Premium animated hero for the landing page.
 */
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Code, Terminal, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/config/routes"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20 pb-32">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] opacity-40 mix-blend-screen" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex flex-row items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Master System Architecture & Full-Stack Development</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground font-serif">
            Confusion to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Clarity.</span>
            <br />
            Concepts to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-primary">Code.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto font-sans leading-relaxed">
            I'm Amarnath Pandey. A mentor, system builder, and career architect. 
            Join my exclusive cohorts to transform your raw potential into production-ready expertise.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/25 rounded-full">
            <Link href={ROUTES.COURSES}>
              Explore Courses <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base rounded-full backdrop-blur-sm bg-background/50 border-border/50 hover:bg-accent/50">
            <Link href={ROUTES.ABOUT}>
              My Story
            </Link>
          </Button>
        </motion.div>

        {/* Floating Code Snippet / Stats (Optional decorative element) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-20 w-full max-w-3xl relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-violet-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <div className="relative flex items-center justify-between p-6 bg-card border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Code className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Production Grade</p>
                <p className="text-xs text-muted-foreground">Architectures</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 border-l border-border/50 pl-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Hands-on Building</p>
                <p className="text-xs text-muted-foreground">Real-world applications</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

