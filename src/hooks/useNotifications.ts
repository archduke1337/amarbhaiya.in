/**
 * @fileoverview useNotifications hook — real-time notification tracking via Appwrite Realtime.
 */
"use client"

import { useEffect, useState, useCallback, useMemo, useRef } from "react"
import client from "@/lib/appwrite/client"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { useAuth } from "@/hooks/useAuth"

type AppNotification = {
  $id: string
  title: string
  message: string
  type: string
  linkUrl?: string
  isRead: boolean
  $createdAt: string
}

export function useNotifications() {
  const { user } = useAuth()
  const userId = user?.$id ?? null
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const unsubscribeRef = useRef<null | (() => void)>(null)

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err)
    }
  }, [userId])

  const channel = useMemo(
    () =>
      `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.notifications}.documents`,
    []
  )

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setIsConnected(false)
      return
    }

    fetchNotifications()

    // Keep only one active subscription to avoid unnecessary websocket reconnect churn.
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    const unsubscribe = client.subscribe(channel, (response) => {
      const doc = response.payload as AppNotification & { userId?: string }
      if (doc.userId !== userId) return

      if (response.events.includes(`${channel}.*.create`)) {
        setNotifications((prev) => {
          if (prev.some((n) => n.$id === doc.$id)) return prev
          return [doc, ...prev]
        })

        if (!doc.isRead) {
          setUnreadCount((prev) => prev + 1)
        }

        if (typeof window !== "undefined" && "Notification" in window && window.Notification.permission === "granted") {
          new window.Notification(doc.title, { body: doc.message })
        }
      }

      if (response.events.includes(`${channel}.*.update`)) {
        setNotifications((prev) => 
          prev.map((n) => (n.$id === doc.$id ? { ...n, ...doc } : n))
        )

        setUnreadCount((prev) => (doc.isRead ? Math.max(0, prev - 1) : prev))
      }
    })

    unsubscribeRef.current = unsubscribe
    setIsConnected(true)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      setIsConnected(false)
    }
  }, [userId, channel, fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications((prev) => 
        prev.map((n) => n.$id === notificationId ? { ...n, isRead: true } : n)
      )
      
      await fetch(`/api/notifications/${notificationId}/read`, { method: "POST" })
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Failed to mark notification as read", err)
    }
  }

  return { notifications, unreadCount, markAsRead, refresh: fetchNotifications, isConnected }
}
