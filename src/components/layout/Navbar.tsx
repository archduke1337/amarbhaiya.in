/**
 * @fileoverview Navbar — public nav + auth state, responsive mobile menu.
 */
"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { ROUTES } from "@/config/routes"

export function Navbar() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.HOME} className="text-xl font-bold">
          Amarnath Bhaiya
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href={ROUTES.COURSES} className="text-sm hover:text-primary transition-colors">Courses</Link>
          <Link href={ROUTES.BLOG} className="text-sm hover:text-primary transition-colors">Blog</Link>
          <Link href={ROUTES.ABOUT} className="text-sm hover:text-primary transition-colors">About</Link>
          <Link href={ROUTES.CONTACT} className="text-sm hover:text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-3">
          {!isLoading && (
            user ? (
              <Link href={ROUTES.APP_DASHBOARD} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Dashboard
              </Link>
            ) : (
              <Link href={ROUTES.LOGIN} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Sign In
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  )
}
