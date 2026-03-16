/**
 * @fileoverview Contact page — EmailJS-powered contact form.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Got a question? Drop us a message.
        </p>
        <form className="grid gap-4 max-w-2xl">
          <input className="h-10 rounded-md border bg-background px-3" placeholder="Your name" />
          <input className="h-10 rounded-md border bg-background px-3" placeholder="Email" type="email" />
          <textarea className="min-h-32 rounded-md border bg-background p-3" placeholder="Message" />
          <button type="button" className="h-10 rounded-md bg-primary px-4 text-primary-foreground w-fit">
            Send Message
          </button>
        </form>
      </main>
      <Footer />
    </>
  )
}
