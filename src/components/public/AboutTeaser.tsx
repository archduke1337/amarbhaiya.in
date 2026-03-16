/**
 * @fileoverview AboutTeaser component stub replaced with an elegant text block.
 */
"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function AboutTeaser() {
  return (
    <section className="py-24 bg-card/50 backdrop-blur border-y border-border/50">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          Who is Amarnath Bhaiya?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-sans">
          I'm an engineer who struggled through the exact same confusing concepts you are facing today. 
          My goal is to distill a decade of Silicon Valley architectural experience into mental models that instantly click.
        </p>
        <Link href="/about" className="inline-flex items-center text-primary font-medium hover:underline text-lg">
          Read my full story <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}
