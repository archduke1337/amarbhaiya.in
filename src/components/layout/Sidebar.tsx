/**
 * @fileoverview Sidebar — role-scoped navigation for panels.
 * Desktop: fixed sidebar. Mobile: sheet overlay triggered by PanelLayout.
 */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { PANEL_NAV, type Role } from "@/config/roles"
import { cn } from "@/lib/utils"

type SidebarProps = {
  panel: Role
  className?: string
  onNavClick?: () => void
}

export function Sidebar({ panel, className, onNavClick }: SidebarProps) {
  const pathname = usePathname()
  const navItems = PANEL_NAV[panel] ?? []

  return (
    <aside className={cn("flex flex-col bg-card", className)}>
      <div className="px-6 py-5 border-b border-border">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {panel}
        </p>
        <h2 className="mt-1 text-lg font-semibold capitalize">{panel} Panel</h2>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/${panel}` && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
