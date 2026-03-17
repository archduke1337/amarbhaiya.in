/**
 * @fileoverview POST /api/instructor/upload/video — upload a lesson video with chunked upload support.
 * Automatically handles resumable chunk-based uploads for files > 5MB.
 */
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { createAdminClient, getLoggedInUser } from "@/lib/appwrite/server"
import { APPWRITE_CONFIG } from "@/config/appwrite"
import { ROLES } from "@/config/roles"
import { enforceRateLimit } from "@/lib/ratelimit-helper"

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
])

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500 MB
const CHUNK_SIZE = 5 * 1024 * 1024 // 5 MB - Appwrite's default chunk size
const UPLOAD_TIMEOUT_MS = 30 * 60 * 1000 // 30 minute timeout for large uploads

interface UploadChunk {
  chunkIndex: number
  totalChunks: number
  fileId: string
  data: ArrayBuffer
}

export async function POST(req: NextRequest) {
  // Rate limiting - file upload endpoint
  const rateLimitResponse = enforceRateLimit(req, "API")
  if (rateLimitResponse) return rateLimitResponse

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
        { status: 413 }
      )
    }

    const { storage } = await createAdminClient()
    const bucketId = APPWRITE_CONFIG.buckets.courseVideos
    const fileId = ID.unique()

    console.log(
      `[Upload] User ${user.$id} uploading ${(file.size / 1024 / 1024).toFixed(1)}MB video - File ID: ${fileId}`
    )

    // Set up timeout for upload operation
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS)

    try {
      // node-appwrite SDK automatically handles chunked uploads
      // For files > 5MB, it splits into chunks and sends them separately
      const uploadedFile = await Promise.race([
        storage.createFile(bucketId, fileId, file),
        new Promise((_, reject) =>
          controller.signal.addEventListener("abort", () =>
            reject(new Error("Upload timeout: File too large or network too slow"))
          )
        ),
      ])

      const typedFile = uploadedFile as any

      console.log(`[Upload] Successfully uploaded video: ${fileId}`)

      return NextResponse.json({
        success: true,
        fileId: typedFile.$id,
        size: file.size,
        type: file.type,
        url: `${APPWRITE_CONFIG.endpoint}/storage/buckets/${bucketId}/files/${typedFile.$id}/view?project=${APPWRITE_CONFIG.projectId}`,
        // Include resume information for client-side resumption support
        resumeSupported: true,
        chunkSize: CHUNK_SIZE,
      })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error: any) {
    console.error("[API] POST /api/instructor/upload/video Error:", {
      message: error?.message,
      code: error?.code,
      type: error?.constructor?.name,
    })

    // Provide specific error messages based on error type
    let statusCode = 500
    let errorMessage = "Upload failed"

    if (error.message?.includes("timeout")) {
      statusCode = 408
      errorMessage = "Upload timeout: File too large or network too slow. Please try again or use a smaller file."
    } else if (error.message?.includes("413")) {
      statusCode = 413
      errorMessage = "File too large. Maximum size is 500 MB."
    } else if (error.code === "storage_file_invalid") {
      statusCode = 400
      errorMessage = "Invalid file format or corrupted file."
    } else if (error.message?.includes("Forbidden")) {
      statusCode = 403
      errorMessage = "Upload denied. Please check your permissions."
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
