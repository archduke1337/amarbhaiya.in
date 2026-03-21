/**
 * @fileoverview About page — Amarnath's story, mission, values, journey.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Target, Lightbulb, TrendingUp, Heart, Code, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Amarnath Bhaiya — a mentor who builds systems that guide students from confusion to clarity and real career outcomes.",
  alternates: { canonical: "/about" },
}

const VALUES = [
  {
    icon: Target,
    title: "Systems-First Thinking",
    description:
      "Every concept is taught through a system — clear inputs, processes, and measurable outputs. No hand-waving.",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    title: "Clarity Over Complexity",
    description:
      "Complex topics broken down into mental models that click instantly. If it's confusing, the explanation isn't good enough.",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    title: "Outcome-Driven",
    description:
      "Every course, session, and resource is designed to produce a tangible career outcome — not just knowledge consumption.",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    icon: Heart,
    title: "Genuine Mentorship",
    description:
      "Not coaching from a script. Real guidance from someone who has navigated the same challenges you're facing.",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    icon: Code,
    title: "Build, Don't Just Learn",
    description:
      "Theory matters, but building real projects is how you internalize knowledge. Every module includes hands-on work.",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    icon: Users,
    title: "Community-Powered Growth",
    description:
      "Learning alone is slow. Our community of focused engineers accelerates everyone through collaboration and accountability.",
    color: "text-cyan-500 bg-cyan-500/10",
  },
]

const MILESTONES = [
  { year: "Started", label: "Began mentoring engineers one-on-one" },
  { year: "Scaled", label: "Launched structured cohort programs" },
  { year: "Built", label: "Created this platform for scalable, systems-driven learning" },
  { year: "Today", label: "Helping engineers move from confusion → clarity → outcomes" },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
              About
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              I Build Systems That Turn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
                Potential Into Outcomes
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              I&apos;m Amarnath Pandey — a mentor and system builder. I struggled through the
              same confusing concepts you&apos;re facing today. My goal is to distill real
              engineering experience into mental models that instantly click, so you can
              skip the years of trial-and-error I went through.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-card/50 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="rounded-2xl border border-border/50 bg-background p-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Mission
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Build a predictable path for engineers to move from uncertainty to real,
                  measurable career outcomes — through structured systems, not ad-hoc advice.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background p-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" /> Approach
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Systems-first mentorship with clear milestones, accountability, and
                  hands-on execution support. Every concept is taught so it clicks immediately.
                </p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background p-6">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> Outcome
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stronger decision-making, production-grade portfolios, and measurable career
                  progress — not just certificates to collect.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey / Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">
              The Journey
            </h2>
            <div className="space-y-8">
              {MILESTONES.map((milestone, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-sm font-black uppercase tracking-widest text-primary">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5" />
                    {i < MILESTONES.length - 1 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-12 bg-border" />
                    )}
                  </div>
                  <p className="text-muted-foreground leading-relaxed pt-0.5">
                    {milestone.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-20 bg-muted/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                What I Stand For
              </h2>
              <p className="text-lg text-muted-foreground">
                These principles shape every course, session, and interaction on this platform.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {VALUES.map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-border/50 bg-background p-6 hover:border-primary/30 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${value.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
