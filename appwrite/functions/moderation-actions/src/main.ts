/**
 * @fileoverview Appwrite function: Moderation Actions.
 * Triggered when a moderation action document is created.
 */
import { Client, Databases, Users, ID } from "node-appwrite"

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!) // Use dynamic API endpoint
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers['x-appwrite-key']!) // Use dynamic runtime API key

  const databases = new Databases(client)
  const users = new Users(client)
  const DB = process.env.APPWRITE_DATABASE_ID!
  const auditLogsCol = process.env.APPWRITE_COLLECTION_AUDIT_LOGS!
  const notificationsCol = process.env.APPWRITE_COLLECTION_NOTIFICATIONS!

  try {
    const action = req.bodyJson
    log(`Processing moderation action: ${action.action} for user ${action.targetUserId}`)

    const actionType = action.action as string

    switch (actionType) {
      case "warn":
        await databases.createDocument(DB, notificationsCol, ID.unique(), {
          userId: action.targetUserId,
          type: "moderation_warning",
          title: "Account Warning",
          message: `You have received a warning: ${action.reason}. Please review our community guidelines.`,
          isRead: false,
        })
        break

      case "mute":
        const mutedUser = await users.get(action.targetUserId)
        const muteLabels = new Set(mutedUser.labels ?? [])
        muteLabels.add("muted")
        await users.updateLabels(action.targetUserId, Array.from(muteLabels))
        break

      case "timeout":
        const timeoutUser = await users.get(action.targetUserId)
        const timeoutLabels = new Set(timeoutUser.labels ?? [])
        timeoutLabels.add("muted")
        await users.updateLabels(action.targetUserId, Array.from(timeoutLabels))
        await databases.createDocument(DB, notificationsCol, ID.unique(), {
          userId: action.targetUserId,
          type: "moderation_timeout",
          title: "Account Timeout",
          message: `Your account has been temporarily restricted. Reason: ${action.reason}`,
          isRead: false,
        })
        break

      case "ban":
        await users.updateStatus(action.targetUserId, false)
        try {
          await users.deleteSessions(action.targetUserId)
        } catch {
          log(`Could not delete sessions for ${action.targetUserId}`)
        }
        break

      case "delete_content":
        log(`Content deleted by moderator: ${action.targetType}/${action.targetId}`)
        break

      case "restore_content":
        log(`Content restored by moderator: ${action.targetType}/${action.targetId}`)
        break

      default:
        log(`Unknown action type: ${actionType}`)
    }

    // Create audit log entry
    await databases.createDocument(DB, auditLogsCol, ID.unique(), {
      userId: action.moderatorId,
      action: `moderation:${actionType}`,
      targetType: action.targetType ?? "user",
      targetId: action.targetId ?? action.targetUserId,
      metadata: JSON.stringify({
        reason: action.reason,
        targetUserId: action.targetUserId,
        expiresAt: action.expiresAt ?? null,
      }),
    })

    return res.json({ success: true })
  } catch (err: any) {
    error(`Moderation action failed: ${err.message}`)
    return res.json({ success: false, error: err.message }, 500)
  }
}
