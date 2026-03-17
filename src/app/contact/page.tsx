/**
 * @fileoverview Contact page — EmailJS-powered contact form.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ContactForm } from "@/components/public/ContactForm"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Amarnath Bhaiya. Ask questions, request mentorship, or explore collaboration opportunities.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-muted-foreground mb-8">
            Have a question about courses, mentorship, or collaboration? Send me a message and I&apos;ll get back to you.
          </p>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  )
}
