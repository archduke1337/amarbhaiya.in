/**
 * @fileoverview Testimonials — Shows a sleek grid of high quality user reviews.
 */
"use client"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

type Testimonial = {
  name: string
  role: string
  text: string
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 bg-muted/20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Don't just take my word for it.
          </h2>
          <p className="text-lg text-muted-foreground">
            Thousands have leveled up their software engineering careers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-10 h-10 text-primary/20 mb-6" />
                <p className="text-foreground leading-relaxed text-lg font-medium mb-8">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-border/50 pt-6 mt-auto">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg border border-border/50 shadow-inner">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
