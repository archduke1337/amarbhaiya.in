/**
 * @fileoverview Stream Video + Chat types — live sessions, RSVPs.
 */
import type { BaseDocument } from "./appwrite"

export interface LiveSession extends BaseDocument {
  title: string
  description?: string
  instructorId: string
  courseId?: string
  streamCallId: string
  streamChannelId: string
  scheduledAt: string
  startedAt?: string
  endedAt?: string
  status: "scheduled" | "live" | "ended" | "cancelled"
  maxParticipants?: number
  isRecorded: boolean
  recordingUrl?: string
  thumbnailFileId?: string
}

export interface SessionRsvp extends BaseDocument {
  sessionId: string
  userId: string
  status: "attending" | "maybe" | "declined"
  joinedAt?: string
}
