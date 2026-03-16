/**
 * @fileoverview Appwrite function: Cleanup Moderation Timeouts.
 * Scheduled (CRON) function to remove "muted" labels from users
 * whose moderation timeouts have expired.
 */
import { Client, Databases, Users, Query } from "node-appwrite"

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT!)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
    .setKey(req.headers['x-appwrite-key']!)

  const databases = new Databases(client)
  const users = new Users(client)
  const DB = process.env.APPWRITE_DATABASE_ID!
  const moderationCol = process.env.APPWRITE_COLLECTION_MODERATION_ACTIONS!

  try {
    const now = new Date().toISOString()
    log(`Running moderation cleanup at: ${now}`)

    // 1. Find expired timeouts that haven't been reverted yet
    const expiredActions = await databases.listDocuments(DB, moderationCol, [
      Query.equal("action", "timeout"),
      Query.equal("isReverted", false),
      Query.lessThan("expiresAt", now),
      Query.limit(100)
    ])

    log(`Found ${expiredActions.total} expired timeouts to process`)

    for (const action of expiredActions.documents) {
      try {
        log(`Unmuting user: ${action.targetUserId} (Action ID: ${action.$id})`)
        
        // Remove the "muted" label
        const user = await users.get(action.targetUserId)
        const labels = (user.labels ?? []).filter((l: string) => l !== "muted")
        await users.updateLabels(action.targetUserId, labels)

        // Mark action as reverted
        await databases.updateDocument(DB, moderationCol, action.$id, {
          isReverted: true
        })
        
        log(`Successfully processed expiry for user ${action.targetUserId}`)
      } catch (userErr: any) {
        error(`Failed to process user ${action.targetUserId}: ${userErr.message}`)
      }
    }

    return res.json({ 
      success: true, 
      processed: expiredActions.documents.length 
    })
  } catch (err: any) {
    error(`Moderation cleanup failed: ${err.message}`)
    return res.json({ success: false, error: err.message }, 500)
  }
}
/**
 * SETUP INSTRUCTIONS:
 * 1. Create a new Appwrite Function named "Moderation Cleanup".
 * 2. Set the Runtime to Node.js 18.0+.
 * 3. Set the Schedule (CRON) to: *\/30 * * * * (Every 30 minutes).
 * 4. Add the following Environment Variables:
 *    - APPWRITE_DATABASE_ID
 *    - APPWRITE_COLLECTION_MODERATION_ACTIONS
 */
