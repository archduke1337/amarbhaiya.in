/**
 * @fileoverview Notification store — Zustand state for in-app notifications.
 */
import { create } from "zustand"
import type { Notification } from "@/types/community"

type NotificationStore = {
  notifications: Notification[]
  unreadCount: number
  setNotifications: (notifications: Notification[]) => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.$id === id ? { ...n, isRead: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      }
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}))
