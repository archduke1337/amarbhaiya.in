/**
 * @fileoverview ContactCTA component.
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export function ContactCTA() {
  return (
    <section className="py-32 bg-background text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-[150px] max-w-3xl mx-auto opacity-50" />
      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Ready to build your career?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Reach out if you have questions about enrollment, syllabus, or enterprise training.
        </p>
        <Button size="lg" className="rounded-full h-14 px-8 shadow-primary/20 shadow-xl group border-none" asChild>
          <Link href="/contact" className="gap-2">
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" /> Contact Me
          </Link>
        </Button>
      </div>
    </section>
  )
}
