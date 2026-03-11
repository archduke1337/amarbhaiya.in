/**
 * @fileoverview RBAC middleware — protects /app, /instructor, /moderator, /admin routes.
 * Uses Appwrite session cookie + user labels for role-based access control.
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Client, Account } from "node-appwrite"

const COOKIE_PREFIX = "a_session_"
const FALLBACK_COOKIE = "a_session_console"

/** Role → allowed route prefixes */
const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/app", "/instructor", "/moderator", "/admin"],
  instructor: ["/app", "/instructor"],
  moderator: ["/app", "/moderator"],
  student: ["/app"],
}

/** Route prefixes that require authentication + authorization */
const PROTECTED_PREFIXES = ["/app", "/instructor", "/moderator", "/admin"]

function getSessionCookie(request: NextRequest): string | undefined {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  const primary = request.cookies.get(`${COOKIE_PREFIX}${projectId}`)
  const fallback = request.cookies.get(FALLBACK_COOKIE)
  return primary?.value ?? fallback?.value
}

function getHighestRole(labels: string[]): string {
  const priority = ["admin", "moderator", "instructor", "student"]
  for (const role of priority) {
    if (labels.includes(role)) return role
  }
  return "student"
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // 1. Check session cookie
  const session = getSessionCookie(request)
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  try {
    // 2. Validate session with Appwrite
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    client.setSession(session)

    const account = new Account(client)
    const user = await account.get()

    // 3. Check role-based access
    const labels = user.labels ?? []
    const role = getHighestRole(labels)
    const allowedPrefixes = ROLE_ROUTES[role] ?? ROLE_ROUTES.student

    const hasAccess = allowedPrefixes.some((p) => pathname.startsWith(p))
    if (!hasAccess) {
      const url = request.nextUrl.clone()
      url.pathname = "/app/dashboard"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  } catch {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/app/:path*", "/instructor/:path*", "/moderator/:path*", "/admin/:path*"],
}
