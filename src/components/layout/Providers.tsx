/**
 * @fileoverview Providers wrapper — HeroUI, NextThemes, AuthProvider.
 */
"use client"

import type React from "react"
import { HeroUIProvider } from "@heroui/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/hooks/useAuth"

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
