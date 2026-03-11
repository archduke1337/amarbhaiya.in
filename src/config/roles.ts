/**
 * @fileoverview Role constants, badge labels, panel access mapping, and moderation actions.
 * All Appwrite Labels used for RBAC are defined here.
 */

export const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  MODERATOR: "moderator",
  STUDENT: "student",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

/** Which route prefixes each role can access */
export const PANEL_ACCESS: Record<Role, string[]> = {
  admin: ["/app", "/instructor", "/moderator", "/admin"],
  instructor: ["/app", "/instructor"],
  moderator: ["/app", "/moderator"],
  student: ["/app"],
}

/** Display names for role badges */
export const ROLE_BADGES: Record<Role, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-red-500/10 text-red-500 border-red-500/20" },
  instructor: { label: "Instructor", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  moderator: { label: "Moderator", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  student: { label: "Student", color: "bg-green-500/10 text-green-500 border-green-500/20" },
}

/** Sidebar navigation for each panel */
export const PANEL_NAV = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Courses", href: "/admin/courses", icon: "BookOpen" },
    { label: "Categories", href: "/admin/categories", icon: "Tag" },
    { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
    { label: "Live", href: "/admin/live", icon: "Video" },
    { label: "Community", href: "/admin/community", icon: "MessageSquare" },
    { label: "Moderation", href: "/admin/moderation", icon: "Shield" },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: "FileText" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
  instructor: [
    { label: "Dashboard", href: "/instructor", icon: "LayoutDashboard" },
    { label: "My Courses", href: "/instructor/courses", icon: "BookOpen" },
    { label: "Live Sessions", href: "/instructor/live", icon: "Video" },
    { label: "Community", href: "/instructor/community", icon: "MessageSquare" },
  ],
  moderator: [
    { label: "Dashboard", href: "/moderator", icon: "LayoutDashboard" },
    { label: "Reports", href: "/moderator/reports", icon: "Flag" },
    { label: "Students", href: "/moderator/students", icon: "Users" },
    { label: "Community", href: "/moderator/community", icon: "MessageSquare" },
    { label: "Live", href: "/moderator/live", icon: "Video" },
  ],
  student: [
    { label: "Dashboard", href: "/app/dashboard", icon: "LayoutDashboard" },
    { label: "Courses", href: "/app/courses", icon: "BookOpen" },
    { label: "Community", href: "/app/community", icon: "MessageSquare" },
    { label: "Certificates", href: "/app/certificates", icon: "Award" },
  ],
} as const

/** Moderation action types */
export const MODERATION_ACTIONS = {
  WARN: "warn",
  MUTE: "mute",
  TIMEOUT: "timeout",
  BAN: "ban",
  DELETE_CONTENT: "delete_content",
  RESTORE_CONTENT: "restore_content",
} as const

export type ModerationAction = (typeof MODERATION_ACTIONS)[keyof typeof MODERATION_ACTIONS]

/** Role priority — higher index = higher privilege */
export const ROLE_PRIORITY: Role[] = ["student", "moderator", "instructor", "admin"]

export function getHighestRole(labels: string[]): Role {
  for (let i = ROLE_PRIORITY.length - 1; i >= 0; i--) {
    if (labels.includes(ROLE_PRIORITY[i])) return ROLE_PRIORITY[i]
  }
  return ROLES.STUDENT
}

export function hasRole(labels: string[], role: Role): boolean {
  return labels.includes(role)
}

export function canAccessPanel(labels: string[], panelPrefix: string): boolean {
  const role = getHighestRole(labels)
  return PANEL_ACCESS[role].some((p) => panelPrefix.startsWith(p))
}
