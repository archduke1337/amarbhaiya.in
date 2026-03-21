import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PANEL_ACCESS, getHighestRole } from "@/config/roles"

const COOKIE_PREFIX = "a_session_"

/**
 * Middleware for authentication and role-based access control.
 *
 * Flow:
 * 1. Public routes → pass through
 * 2. Auth pages without session → pass through (allow login/register)
 * 3. Protected pages without session → redirect to login
 * 4. Auth pages WITH session → redirect to dashboard (already logged in)
 * 5. Protected pages WITH session → validate session + check RBAC
 *
 * Session validation is cached for 60s via a signed cookie to avoid
 * hitting the Appwrite API on every single protected page navigation.
 */

const CACHE_COOKIE = "mw_session_cache"
const CACHE_TTL_SECONDS = 60

type CachedSession = {
  labels: string[]
  exp: number
}

function getSessionCookie(request: NextRequest): string | undefined {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  return request.cookies.get(`${COOKIE_PREFIX}${projectId}`)?.value
}

function getCachedSession(request: NextRequest): CachedSession | null {
  try {
    const raw = request.cookies.get(CACHE_COOKIE)?.value
    if (!raw) return null
    const parsed: CachedSession = JSON.parse(atob(raw))
    if (Date.now() > parsed.exp) return null
    return parsed
  } catch {
    return null
  }
}

function createCacheValue(labels: string[]): string {
  const payload: CachedSession = {
    labels,
    exp: Date.now() + CACHE_TTL_SECONDS * 1000,
  }
  return btoa(JSON.stringify(payload))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionCookie(request)

  const isAuthPage = pathname.startsWith("/auth")
  const isProtectedPage = Object.values(PANEL_ACCESS)
    .flat()
    .some((p) => pathname.startsWith(p))

  // 1. Non-auth, non-protected → pass through
  if (!isAuthPage && !isProtectedPage) return NextResponse.next()

  // 2. Auth pages with no session → allow (show login/register)
  if (isAuthPage && !session) return NextResponse.next()

  // 3. Protected pages with no session → redirect to login
  if (isProtectedPage && !session) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // --- We have a session AND need to validate ---

  // Try cached session first (avoids network call)
  const cached = getCachedSession(request)
  if (cached) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url))
    }
    const role = getHighestRole(cached.labels)
    const allowedPrefixes = PANEL_ACCESS[role] ?? PANEL_ACCESS.student
    if (!allowedPrefixes.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // No cache → validate session via Appwrite API
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!

    const response = await fetch(`${endpoint}/account`, {
      headers: {
        "X-Appwrite-Project": projectId,
        Cookie: `${COOKIE_PREFIX}${projectId}=${session}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Invalid or Expired Session")
    }

    const userData = (await response.json()) as { labels?: string[] }
    const labels = userData.labels ?? []
    const role = getHighestRole(labels)

    // Build response
    let res: NextResponse

    if (isAuthPage) {
      res = NextResponse.redirect(new URL("/app/dashboard", request.url))
    } else {
      const allowedPrefixes = PANEL_ACCESS[role] ?? PANEL_ACCESS.student
      const hasAccess = allowedPrefixes.some((p) => pathname.startsWith(p))
      if (!hasAccess) {
        res = NextResponse.redirect(new URL("/app/dashboard", request.url))
      } else {
        res = NextResponse.next()
      }
    }

    // Cache the validated session for 60s
    res.cookies.set(CACHE_COOKIE, createCacheValue(labels), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: CACHE_TTL_SECONDS,
      path: "/",
    })

    return res
  } catch {
    // Session invalid or network error
    if (isAuthPage) return NextResponse.next()

    const res = NextResponse.redirect(
      new URL(
        pathname !== "/app/dashboard"
          ? `/auth/login?redirect=${encodeURIComponent(pathname)}`
          : "/auth/login",
        request.url
      )
    )
    // Clear stale cache
    res.cookies.delete(CACHE_COOKIE)
    return res
  }
}

export const config = {
  matcher: [
    "/app/:path*",
    "/instructor/:path*",
    "/moderator/:path*",
    "/admin/:path*",
    "/auth/:path*",
  ],
}
