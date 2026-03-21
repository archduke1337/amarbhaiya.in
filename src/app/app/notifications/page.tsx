/**
 * @fileoverview Notifications page — lists all notifications for the current user.
 */
"use client"

import { useNotifications } from "@/hooks/useNotifications"
import { PanelLayout } from "@/components/layout/PanelLayout"
import { useAuth } from "@/hooks/useAuth"
import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotificationsPage() {
  const { role } = useAuth()
  const { notifications, unreadCount, markAsRead, isConnected } = useNotifications()

  return (
    <PanelLayout panel={role || "student"}>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => notifications.forEach((n) => !n.isRead && markAsRead(n.$id))}
            >
              <Check className="w-4 h-4" /> Mark all read
            </Button>
          )}
        </div>

        {!isConnected && notifications.length === 0 ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-3xl bg-muted/5">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.$id}
                className={`rounded-xl border p-4 transition-colors ${
                  notification.isRead
                    ? "border-border/50 bg-card/50"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                    {new Date(notification.$createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PanelLayout>
  )
}
