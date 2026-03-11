/**
 * @fileoverview Footer — brand info, navigation, social links.
 */
import Link from "next/link"
import { ROUTES } from "@/config/routes"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-3">Amarnath Bhaiya</h3>
            <p className="text-sm text-muted-foreground">
              Mentor, System Builder, Career Architect.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={ROUTES.COURSES}>Courses</Link>
              <Link href={ROUTES.BLOG}>Blog</Link>
              <Link href={ROUTES.ABOUT}>About</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Support</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href={ROUTES.CONTACT}>Contact</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Amarnath Bhaiya. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
