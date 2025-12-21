import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const ACCESS_COOKIE = "storetrack.accessToken"

const AUTH_PATHS = new Set(["/signin", "/signup", "/forgot-password", "/reset-password"])

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If already authenticated, keep users out of auth pages.
  if (AUTH_PATHS.has(pathname)) {
    const hasAccessCookie = Boolean(request.cookies.get(ACCESS_COOKIE)?.value)
    if (hasAccessCookie) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      url.search = ""
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/signin", "/signup", "/forgot-password", "/reset-password"],
}
