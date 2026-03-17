/**
 * @fileoverview Robots.txt — allows public pages, blocks admin/app/auth/API routes.
 */
import type { MetadataRoute } from "next"
import { getPublicAppUrl } from "@/lib/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicAppUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/courses", "/blog", "/contact"],
        disallow: [
          "/admin/",
          "/app/",
          "/instructor/",
          "/moderator/",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
