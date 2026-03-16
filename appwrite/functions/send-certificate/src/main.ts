/**
 * @fileoverview Appwrite function: Send Certificate.
 * Triggered when a certificate document is created.
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
  const notificationsCol = process.env.APPWRITE_COLLECTION_NOTIFICATIONS!
  const coursesCol = process.env.APPWRITE_COLLECTION_COURSES!

  try {
    const certificate = req.bodyJson
    log(`Processing certificate: ${certificate.$id}`)

    // Fetch user and course details
    const [user, course] = await Promise.all([
      users.get(certificate.userId),
      databases.getDocument(DB, coursesCol, certificate.courseId),
    ])

    const courseName = (course.title as string) ?? "your course"
    const userName = user.name ?? "Student"

    log(`Certificate for ${userName} — course: ${courseName}`)

    // Generate a download URL for the certificate file
    const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT!
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID!
    const bucketId = process.env.APPWRITE_BUCKET_CERTIFICATES!
    const fileId = certificate.certificateFileId

    const certificateUrl = fileId
      ? `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`
      : null

    // Send notification to user
    await databases.createDocument(DB, notificationsCol, ID.unique(), {
      userId: certificate.userId,
      type: "certificate",
      title: "Certificate Earned!",
      message: `Congratulations, ${userName}! You've earned your certificate for "${courseName}".`,
      linkUrl: `/app/certificates`,
      isRead: false,
    })

    log(`Certificate notification sent to user ${certificate.userId}`)
    return res.json({
      success: true,
      certificateUrl,
      userId: certificate.userId,
      courseName,
    })
  } catch (err: any) {
    error(`Send certificate failed: ${err.message}`)
    return res.json({ success: false, error: err.message }, 500)
  }
}
