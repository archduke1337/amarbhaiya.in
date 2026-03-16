/**
 * @fileoverview Environment helpers for stable URL resolution across local, preview, and production.
 */

function withHttps(hostOrUrl: string) {
  if (hostOrUrl.startsWith("http://") || hostOrUrl.startsWith("https://")) {
    return hostOrUrl
  }

  return `https://${hostOrUrl}`
}

export function getPublicAppUrl() {
  const explicit = process.env.NEXT_PUBLIC_APP_URL
  if (explicit) return withHttps(explicit)

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (productionHost) return withHttps(productionHost)

  const previewHost = process.env.VERCEL_URL
  if (previewHost) return withHttps(previewHost)

  return "http://localhost:3000"
}
