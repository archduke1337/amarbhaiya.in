/**
 * @fileoverview Terms of Service — standard terms page.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Amarnath Bhaiya platform — rules and conditions for using our services.",
  alternates: { canonical: "/terms" },
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <article className="prose dark:prose-invert max-w-3xl mx-auto">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Amarnath Bhaiya platform, you agree to be bound by these Terms
            of Service. If you do not agree with any part of these terms, you may not use our services.
          </p>

          <h2>2. Account Registration</h2>
          <p>
            You must provide accurate and complete information when creating an account. You are responsible
            for maintaining the confidentiality of your account credentials and for all activities under
            your account.
          </p>

          <h2>3. Course Access & Enrollment</h2>
          <ul>
            <li>Paid courses grant you personal, non-transferable access to the course content</li>
            <li>Free courses are accessible to all registered users</li>
            <li>Course content may be updated or modified at any time to improve quality</li>
            <li>You may not redistribute, resell, or share course materials without explicit permission</li>
          </ul>

          <h2>4. Payments & Refunds</h2>
          <p>
            All payments are processed securely through our payment partners. Refund requests may be
            submitted within 7 days of purchase, subject to our refund policy. Refund eligibility
            depends on the amount of course content accessed.
          </p>

          <h2>5. Community Guidelines</h2>
          <p>When participating in forums, comments, or live sessions, you agree to:</p>
          <ul>
            <li>Be respectful and constructive in all interactions</li>
            <li>Not post spam, promotional content, or misleading information</li>
            <li>Not harass, bully, or intimidate other users</li>
            <li>Report any violations to our moderation team</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            All course content, including videos, text, code examples, and supplementary materials,
            is the intellectual property of Amarnath Bhaiya. You are granted a limited license to
            access this content for personal educational use only.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Our platform is provided on an &quot;as-is&quot; basis. While we strive to provide accurate
            and up-to-date information, we make no guarantees about specific career outcomes or
            results from using our courses.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Significant changes will be
            communicated via email or platform notification. Continued use of the platform after
            changes constitutes acceptance of the updated terms.
          </p>

          <h2>9. Contact</h2>
          <p>
            For questions about these Terms, please contact us through our{" "}
            <a href="/contact">contact page</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
