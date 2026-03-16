/**
 * @fileoverview POST /api/instructor/upload/video — upload a lesson video to Appwrite storage.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { createAdminClient, getLoggedInUser } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { ROLES } from "@/config/roles"

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
])

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB

export async function POST(req: NextRequest) {
  try {
    const user = await getLoggedInUser()
    if (!user || (!user.labels.includes(ROLES.INSTRUCTOR) && !user.labels.includes(ROLES.ADMIN))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Allowed: mp4, webm, ogg, mov` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 500 MB` },
        { status: 400 }
      )
    }

    const { storage } = await createAdminClient()
    const bucketId = APPWRITE_CONFIG.buckets.courseVideos
    
    // We use node-appwrite for the actual upload
    const uploadedFile = await storage.createFile(bucketId, ID.unique(), file)

    return NextResponse.json({ 
      success: true, 
      fileId: uploadedFile.$id,
      url: `${APPWRITE_CONFIG.endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${APPWRITE_CONFIG.projectId}`
    })
  } catch (error: any) {
    console.error("[API] POST /api/instructor/upload/video", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
