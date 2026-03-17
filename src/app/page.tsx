/**
 * @fileoverview Landing page — Amarnath's brand showcase with hero, featured courses, stats.
 */
import { HeroSection } from "@/components/public/HeroSection"
import { IdentityCards } from "@/components/public/IdentityCards"
import { AboutTeaser } from "@/components/public/AboutTeaser"
import { FeaturedCourses } from "@/components/public/FeaturedCourses"
import { StatsSection } from "@/components/public/StatsSection"
import { Testimonials } from "@/components/public/Testimonials"
import { LiveSessionCTA } from "@/components/public/LiveSessionCTA"
import { CommunitySection } from "@/components/public/CommunitySection"
import { BlogTeaser } from "@/components/public/BlogTeaser"
import { SocialLinks } from "@/components/public/SocialLinks"
import { ContactCTA } from "@/components/public/ContactCTA"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Amarnath Bhaiya",
        url: "https://amarbhaiya.in",
        description: "A mentor who builds systems that guide students from confusion → clarity → outcomes.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: "Amarnath Bhaiya",
        url: "https://amarbhaiya.in",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://amarbhaiya.in/courses?search={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <IdentityCards />
        <AboutTeaser />
        <FeaturedCourses />
        <StatsSection />
        <Testimonials />
        <LiveSessionCTA />
        <CommunitySection />
        <BlogTeaser />
        <SocialLinks />
        <ContactCTA />
      </main>
      <Footer />
    </>
  )
}
