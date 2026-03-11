/**
 * @fileoverview Base Appwrite document interface used by all typed collections.
 */
import { Models } from "appwrite"

export type AppwriteDocument = Models.Document

export interface BaseDocument {
  $id: string
  $collectionId: string
  $databaseId: string
  $createdAt: string
  $updatedAt: string
  $permissions: string[]
}
