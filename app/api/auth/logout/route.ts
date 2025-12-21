import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const ACCESS_COOKIE = "storetrack.accessToken"
const REFRESH_COOKIE = "storetrack.refreshToken"
const STAFF_REFRESH_COOKIE = "storetrack.staffRefreshToken"

export async function POST(request: Request) {
  // Best-effort: if this is a staff session, revoke backend refresh token.
  // (Owner sessions don't currently have an explicit /auth/logout route in the API.)
  try {
    const staffRefreshToken = (await cookies()).get(STAFF_REFRESH_COOKIE)?.value
    if (staffRefreshToken) {
      const url = new URL("/api/proxy/staff-auth/logout", request.url)
      await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken: staffRefreshToken }),
      })
    }
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ok: true })

  res.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  res.cookies.set(STAFF_REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return res
}
