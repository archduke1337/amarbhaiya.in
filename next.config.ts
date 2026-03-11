/**
 * @fileoverview Next.js configuration with Turbopack.
 */
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
  experimental: {
    turbo: {},
  },
}

export default nextConfig
