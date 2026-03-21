/**
 * @fileoverview Privacy Policy — standard privacy policy page.
 */
import type { Metadata } from "next"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Amarnath Bhaiya platform — how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <article className="prose dark:prose-invert max-w-3xl mx-auto">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 2026</p>

          <h2>1. Information We Collect</h2>
          <p>
            When you create an account on our platform, we collect your name, email address, and any
            additional profile information you choose to provide. When you enroll in courses or make
            payments, we collect transaction-related information necessary to process your purchase.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our services, including course access and progress tracking</li>
            <li>To process payments securely through our payment partners (Razorpay, PhonePe)</li>
            <li>To send you important updates about your courses, certificates, and account</li>
            <li>To improve our platform based on usage patterns and feedback</li>
          </ul>

          <h2>3. Data Storage & Security</h2>
          <p>
            Your data is stored securely on Appwrite Cloud infrastructure. We implement industry-standard
            security measures including encrypted connections (HTTPS), secure session management, and
            access controls. We never store your payment card details — all payment processing is handled
            by our certified payment partners.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Appwrite</strong> — Authentication, database, and file storage</li>
            <li><strong>Razorpay / PhonePe</strong> — Payment processing</li>
            <li><strong>Stream</strong> — Live video sessions and chat</li>
            <li><strong>Vercel</strong> — Application hosting and analytics</li>
            <li><strong>EmailJS</strong> — Contact form email delivery</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time through
            your account settings. You can also request a complete data export or account deletion by
            contacting us.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. We do not use tracking
            cookies or third-party advertising cookies.
          </p>

          <h2>7. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our{" "}
            <a href="/contact">contact page</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
