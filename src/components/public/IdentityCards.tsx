/**
 * @fileoverview IdentityCards — highlight different personas or learning paths (e.g. Student, Developer, Architect).
 */
"use client"

import { motion } from "framer-motion"
import { MonitorPlay, Layers, ServerCog } from "lucide-react"

const paths = [
  {
    icon: MonitorPlay,
    title: "The Developer",
    description: "Write clean, robust code with confidence. Master frontend to backend integration.",
    color: "from-blue-500/20 to-cyan-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Layers,
    title: "The Architect",
    description: "Design systems that scale to millions of users. Learn to make the right tradeoffs.",
    color: "from-violet-500/20 to-fuchsia-500/5",
    iconColor: "text-violet-500",
  },
  {
    icon: ServerCog,
    title: "The DevOps Engineer",
    description: "Automate, deploy, and monitor. Keep production safe and shipping fast.",
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-500",
  },
]

export function IdentityCards() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Pick Your Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're starting fresh or leveling up, there's a roadmap tailored to your ambition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {paths.map((path, index) => {
            const Icon = path.icon
            return (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl opacity-50`} />
                
                <div className="relative h-full bg-card border border-border/50 rounded-3xl p-8 backdrop-blur-xl shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-background border border-border/50 shadow-sm mb-6 ${path.iconColor}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{path.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
