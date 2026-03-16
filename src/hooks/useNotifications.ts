/**
 * @fileoverview useNotifications hook — real-time notification tracking via Appwrite Realtime.
 */
"use client"

import { useEffect, useState, useCallback } from "react"
import client, { databases } from "@/lib/appwrite/client"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { useAuth } from "@/hooks/useAuth"

type Notification = {
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
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
  }, [user])

  useEffect(() => {
    if (!user) return

    fetchNotifications()

    // Subscribe to real-time changes in the notifications collection
    // This will catch new notifications as they are created
    const channel = `databases.${APPWRITE_CONFIG.databaseId}.collections.${APPWRITE_CONFIG.collections.notifications}.documents`
    
    const unsubscribe = client.subscribe(channel, (response) => {
      // Check if the document belongs to the current user
      const doc = response.payload as any
      if (doc.userId !== user.$id) return

      if (response.events.includes(`${channel}.*.create`)) {
        setNotifications((prev) => [doc, ...prev])
        setUnreadCount((prev) => prev + 1)
        
        // Show a browser notification if possible
        if (Notification.permission === "granted") {
          new Notification(doc.title, { body: doc.message })
        }
      }

      if (response.events.includes(`${channel}.*.update`)) {
        setNotifications((prev) => 
          prev.map((n) => (n.$id === doc.$id ? { ...n, ...doc } : n))
        )
        // Recalculate unread count if isRead changed
        if (doc.isRead === true) {
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [user, fetchNotifications])

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

  return { notifications, unreadCount, markAsRead, refresh: fetchNotifications }
}
