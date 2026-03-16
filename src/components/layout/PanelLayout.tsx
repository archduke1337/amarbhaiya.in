"use client"
import { Sidebar } from "./Sidebar"
import { UserMenu } from "./UserMenu"
import { Bell } from "lucide-react"
import type { Role } from "@/config/roles"
import { useNotifications } from "@/hooks/useNotifications"

type PanelLayoutProps = {
  panel: Role
  children: React.ReactNode
}

export function PanelLayout({ panel, children }: PanelLayoutProps) {
  const { unreadCount } = useNotifications()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar panel={panel} />
      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground capitalize">
                {panel} PANEL
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </button>
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
