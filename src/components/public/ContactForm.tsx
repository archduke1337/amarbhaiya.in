/**
 * @fileoverview ContactForm — working contact form with EmailJS integration.
 */
"use client"

import { useState, type FormEvent } from "react"
import { sendContactEmail } from "@/lib/emailjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2 } from "lucide-react"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      setError("Please fill in all fields.")
      setStatus("error")
      return
    }

    try {
      await sendContactEmail({ name, email, message, subject: "Contact Form Inquiry" })
      setStatus("sent")
      ;(e.target as HTMLFormElement).reset()
    } catch {
      setError("Failed to send message. Please try again or email directly.")
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          placeholder="Your name"
          required
          disabled={status === "sending"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          disabled={status === "sending"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="What would you like to discuss?"
          className="min-h-32"
          required
          disabled={status === "sending"}
        />
      </div>
      <Button type="submit" size="lg" disabled={status === "sending"} className="w-fit">
        {status === "sending" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
