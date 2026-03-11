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
  return (
    <>
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
