/**
 * @fileoverview LoadingSpinner - reusable loading indicator.
 */
"use client"

import { Loader2 } from "lucide-react"

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg"
  label?: string
}

const SIZE_CLASS = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const

export function LoadingSpinner({ size = "md", label }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Loader2 className={`${SIZE_CLASS[size]} animate-spin`} />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  )
}
