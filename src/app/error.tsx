/**
 * @fileoverview Global error boundary — catches unhandled errors.
 */
"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl font-extrabold tracking-tighter opacity-20">Error</div>
      <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  )
}
