/**
 * @fileoverview Global 404 page — branded not-found experience.
 */
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-extrabold tracking-tighter opacity-20">404</div>
      <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  )
}
