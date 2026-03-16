/**
 * @fileoverview useAuth hook — current user + role from Appwrite.
 */
"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { Models } from "appwrite"
import { getHighestRole, type Role } from "@/config/roles"

type AuthState = {
  user: Models.User<Models.Preferences> | null
  role: Role
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  role: "student",
  isLoading: true,
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        setUser(null)
        return
      }

      const payload = await response.json() as { user?: Models.User<Models.Preferences> | null }
      setUser(payload.user ?? null)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const role = getHighestRole(user?.labels ?? [])

  return (
    <AuthContext.Provider value={{ user, role, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  return useContext(AuthContext)
}
