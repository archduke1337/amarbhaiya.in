import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PANEL_ACCESS, getHighestRole } from "@/config/roles"

const COOKIE_PREFIX = "a_session_"
const FALLBACK_COOKIE = "a_session_console"

function getSessionCookie(request: NextRequest): string | undefined {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? ""
  const primary = request.cookies.get(`${COOKIE_PREFIX}${projectId}`)
  const fallback = request.cookies.get(FALLBACK_COOKIE)
  return primary?.value ?? fallback?.value
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = getSessionCookie(request)

  const isAuthPage = pathname.startsWith("/auth")
  const isProtectedPage = Object.values(PANEL_ACCESS).flat().some(p => pathname.startsWith(p))
  
  if (!isAuthPage && !isProtectedPage) return NextResponse.next()

  // Guest users on Auth pages are always allowed
  if (isAuthPage && !session) return NextResponse.next()

  // Protected pages require session
  if (isProtectedPage && !session) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // We have a session AND (isAuthPage OR isProtectedPage)
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!

    // Validate via Server-to-Server fetch (Edge compatible)
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

    const ObjectUserParams = await response.json()
    const user = ObjectUserParams as { labels?: string[] }

    // 1. If on login page but already logged in -> redirect to dashboard       
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url))      
    }

    // 2. Role validation for protected pages
    const labels = user.labels ?? []
    const role = getHighestRole(labels)
    const allowedPrefixes = PANEL_ACCESS[role] ?? PANEL_ACCESS.student

    const hasAccess = allowedPrefixes.some((p) => pathname.startsWith(p))       
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/app/dashboard", request.url))      
    }

    return NextResponse.next()
  } catch (error) {
    // If session is invalid or expired
    if (isAuthPage) return NextResponse.next()

    const url = new URL("/auth/login", request.url)
    if (pathname !== "/app/dashboard") {
       url.searchParams.set("redirect", pathname)
    }
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/app/:path*", "/instructor/:path*", "/moderator/:path*", "/admin/:path*", "/auth/:path*"],
}
