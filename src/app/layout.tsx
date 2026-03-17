/**
 * @fileoverview Root layout — global providers, fonts, metadata.
 */
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Figtree, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { getPublicAppUrl } from "@/lib/env"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getPublicAppUrl()),
  title: "Amarnath Bhaiya | Mentor, System Builder, Career Architect",
  description:
    "A mentor who builds systems that guide students from confusion → clarity → outcomes.",
  keywords: ["Amarnath Bhaiya", "Mentor", "Career Architect", "System Builder", "LMS"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Amarnath Bhaiya | Mentor, System Builder, Career Architect",
    description: "A mentor who builds systems that guide students from confusion → clarity → outcomes.",
    images: ["/og-image.jpg"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f4ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a14" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
