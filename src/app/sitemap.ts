/**
 * @fileoverview Dynamic sitemap for search engines.
 * Includes all public pages and published courses.
 */
import type { MetadataRoute } from "next"
import { getPublicAppUrl } from "@/lib/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getPublicAppUrl()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  // Dynamic: published courses
  let coursePages: MetadataRoute.Sitemap = []
  try {
    const { coursesDb } = await import("@/lib/appwrite/database")
    const { Query } = await import("node-appwrite")
    const result = await coursesDb.list({
      queries: [Query.equal("status", "published")],
      limit: 500,
    })
    coursePages = result.documents.map((course: any) => ({
      url: `${baseUrl}/courses/${course.slug || course.$id}`,
      lastModified: new Date(course.$updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // If DB is unavailable, return only static pages
  }

  return [...staticPages, ...coursePages]
}
