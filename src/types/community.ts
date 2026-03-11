/**
 * @fileoverview Community types — comments, forums, moderation records.
 */
import type { BaseDocument } from "./appwrite"
import type { ModerationAction } from "@/config/roles"

export interface CourseComment extends BaseDocument {
  courseId: string
  lessonId?: string
  userId: string
  parentId?: string
  content: string
  isEdited: boolean
  isFlagged: boolean
  isDeleted: boolean
}

export interface ForumCategory extends BaseDocument {
  name: string
  slug: string
  description?: string
  order: number
  isActive: boolean
}

export interface ForumThread extends BaseDocument {
  categoryId: string
  userId: string
  title: string
  content: string
  isPinned: boolean
  isLocked: boolean
  isFlagged: boolean
  replyCount: number
  lastReplyAt?: string
}

export interface ForumReply extends BaseDocument {
  threadId: string
  userId: string
  content: string
  isEdited: boolean
  isFlagged: boolean
  isDeleted: boolean
}

export interface ModerationActionRecord extends BaseDocument {
  targetUserId: string
  moderatorId: string
  action: ModerationAction
  reason: string
  targetType: "comment" | "thread" | "reply" | "user"
  targetId: string
  expiresAt?: string
  isReverted: boolean
  revertedBy?: string
  revertedAt?: string
}

export interface AuditLog extends BaseDocument {
  userId: string
  action: string
  targetType: string
  targetId: string
  metadata?: Record<string, unknown>
  ipAddress?: string
}

export interface Notification extends BaseDocument {
  userId: string
  type: string
  title: string
  message: string
  linkUrl?: string
  isRead: boolean
  readAt?: string
}
