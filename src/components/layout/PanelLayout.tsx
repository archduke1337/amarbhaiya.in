/**
 * @fileoverview PanelLayout — shared wrapper for instructor/moderator/admin panels.
 * Includes sidebar, top bar, and content area.
 */
import { Sidebar } from "./Sidebar"
import type { Role } from "@/config/roles"

type PanelLayoutProps = {
  panel: Role
  children: React.ReactNode
}

export function PanelLayout({ panel, children }: PanelLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar panel={panel} />
      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground capitalize">
                {panel}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {/* TODO: NotificationBell, UserMenu */}
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
