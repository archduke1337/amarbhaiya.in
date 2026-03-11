/**
 * @fileoverview Appwrite Storage helpers — upload, get URL, delete files.
 */
import { ID } from "node-appwrite"
import { createAdminClient } from "./server"
import { APPWRITE_CONFIG, type BucketKey } from "@/config/appwrite"

/** Upload a file to a specific bucket */
export async function uploadFile(bucketKey: BucketKey, file: File) {
  const { storage } = await createAdminClient()
  const bucketId = APPWRITE_CONFIG.buckets[bucketKey]
  return storage.createFile(bucketId, ID.unique(), file)
}

/** Get a file view URL */
export function getFileViewUrl(bucketKey: BucketKey, fileId: string): string {
  const bucketId = APPWRITE_CONFIG.buckets[bucketKey]
  return `${APPWRITE_CONFIG.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${APPWRITE_CONFIG.projectId}`
}

/** Get a file preview URL (for images) */
export function getFilePreviewUrl(bucketKey: BucketKey, fileId: string, width = 400, height = 300): string {
  const bucketId = APPWRITE_CONFIG.buckets[bucketKey]
  return `${APPWRITE_CONFIG.endpoint}/storage/buckets/${bucketId}/files/${fileId}/preview?project=${APPWRITE_CONFIG.projectId}&width=${width}&height=${height}`
}

/** Delete a file from a bucket */
export async function deleteFile(bucketKey: BucketKey, fileId: string) {
  const { storage } = await createAdminClient()
  const bucketId = APPWRITE_CONFIG.buckets[bucketKey]
  return storage.deleteFile(bucketId, fileId)
}

/** Get file metadata */
export async function getFileMetadata(bucketKey: BucketKey, fileId: string) {
  const { storage } = await createAdminClient()
  const bucketId = APPWRITE_CONFIG.buckets[bucketKey]
  return storage.getFile(bucketId, fileId)
}
