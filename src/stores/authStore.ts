/**
 * @fileoverview Auth store — Zustand global state for user + role.
 */
import { create } from "zustand"
import type { Models } from "appwrite"
import type { Role } from "@/config/roles"
import { getHighestRole } from "@/config/roles"

type AuthStore = {
  user: Models.User<Models.Preferences> | null
  role: Role
  isLoading: boolean
  setUser: (user: Models.User<Models.Preferences> | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: "student",
  isLoading: true,
  setUser: (user) =>
    set({
      user,
      role: getHighestRole(user?.labels ?? []),
      isLoading: false,
    }),
  clearAuth: () =>
    set({
      user: null,
      role: "student",
      isLoading: false,
    }),
}))
