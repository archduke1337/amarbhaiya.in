/**
 * @fileoverview User-related types — profile, preferences, role labels.
 */
import type { BaseDocument } from "./appwrite"
import type { Role } from "@/config/roles"

export interface UserProfile extends BaseDocument {
  userId: string
  name: string
  email: string
  phone?: string
  avatarFileId?: string
  bio?: string
  headline?: string
  website?: string
  socialLinks?: Record<string, string>
  labels: Role[]
  isVerified: boolean
  isActive: boolean
  lastLoginAt?: string
}
