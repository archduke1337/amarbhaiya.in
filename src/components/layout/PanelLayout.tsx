"use client"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { UserMenu } from "./UserMenu"
import { Bell, Menu } from "lucide-react"
import type { Role } from "@/config/roles"
import { useNotifications } from "@/hooks/useNotifications"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type PanelLayoutProps = {
  panel: Role
  children: React.ReactNode
}

export function PanelLayout({ panel, children }: PanelLayoutProps) {
  const { unreadCount } = useNotifications()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar panel={panel} className="hidden w-64 border-r border-border lg:flex" />

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors" aria-label="Open sidebar">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <Sidebar panel={panel} className="h-full" onNavClick={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground capitalize">
                {panel} PANEL
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/app/notifications"
                className="relative text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
