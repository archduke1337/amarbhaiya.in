/**
 * @fileoverview NotificationBell - unread count and quick actions.
 */
"use client"

import { Bell } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const { unreadCount, isConnected, refresh } = useNotifications()

  return (
    <Button variant="ghost" size="icon" onClick={refresh} className="relative" aria-label="Notifications">
      <Bell className="size-5" />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-destructive px-1 text-[10px] text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
      <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
    </Button>
  )
}
