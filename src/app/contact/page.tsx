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
        {/* TODO: ContactCTA EmailJS form component */}
      </main>
      <Footer />
    </>
  )
}
