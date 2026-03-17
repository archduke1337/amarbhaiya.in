/**
 * @fileoverview SocialLinks — links to social profiles.
 */
import { Github, Linkedin, Twitter, Youtube } from "lucide-react"

const SOCIAL_LINKS = [
  { icon: Youtube, href: "https://youtube.com/@amarbhaiya", label: "YouTube", color: "hover:text-red-500" },
  { icon: Linkedin, href: "https://linkedin.com/in/amarbhaiya", label: "LinkedIn", color: "hover:text-blue-500" },
  { icon: Twitter, href: "https://twitter.com/amarbhaiya", label: "Twitter", color: "hover:text-sky-500" },
  { icon: Github, href: "https://github.com/amarbhaiya", label: "GitHub", color: "hover:text-foreground" },
]

export function SocialLinks() {
  return (
    <section className="py-16 bg-muted/20 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Follow the Journey
        </p>
        <div className="flex items-center justify-center gap-6">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`p-3 rounded-xl border border-border/50 bg-card/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color}`}
              >
                <Icon className="w-5 h-5" />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
