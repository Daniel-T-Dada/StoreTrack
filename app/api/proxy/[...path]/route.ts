import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const ACCESS_COOKIE = "storetrack.accessToken"
const USER_REFRESH_COOKIE = "storetrack.refreshToken"
const STAFF_REFRESH_COOKIE = "storetrack.staffRefreshToken"

const BACKEND_API_BASE_URL =
    process.env.BACKEND_API_URL ?? "https://store-track-api.vercel.app/api"

type RouteContext = { params: Promise<{ path: string[] }> }

async function proxy(request: Request, context: RouteContext) {
    const { path } = await context.params

    const targetUrl = new URL(
        `${BACKEND_API_BASE_URL.replace(/\/$/, "")}/${path.join("/")}`
    )

    const incomingUrl = new URL(request.url)
    targetUrl.search = incomingUrl.search

    const requestHeaders = new Headers(request.headers)

    // Don’t forward hop-by-hop headers.
    requestHeaders.delete("host")
    requestHeaders.delete("content-length")

    // Attach access token as Bearer (backend is token-based).
    const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value
    if (accessToken) requestHeaders.set("authorization", `Bearer ${accessToken}`)

    const method = request.method.toUpperCase()
    const isBodyless = method === "GET" || method === "HEAD"

    let body: BodyInit | undefined
    if (!isBodyless) {
        const isUserRefresh = method === "POST" && path[0] === "auth" && path[1] === "refresh"
        const isStaffRefresh = method === "POST" && path[0] === "staff-auth" && path[1] === "refresh"
        const isRefresh = isUserRefresh || isStaffRefresh

        if (isRefresh) {
            // If the client didn’t send a body (common with axios), send refreshToken from cookie.
            // Don’t rely on Content-Type: axios may set it even when the body is empty.
            const raw = await request.text()
            if (raw && raw.trim().length > 0) {
                const contentType = request.headers.get("content-type")
                if (contentType) requestHeaders.set("content-type", contentType)
                body = raw
            } else {
                const refreshCookieName = isStaffRefresh ? STAFF_REFRESH_COOKIE : USER_REFRESH_COOKIE
                const refreshToken = (await cookies()).get(refreshCookieName)?.value
                if (refreshToken) {
                    requestHeaders.set("content-type", "application/json")
                    body = JSON.stringify({ refreshToken })
                } else {
                    body = undefined
                }
            }
        } else {
            body = await request.arrayBuffer()
        }
    }

    const backendRes = await fetch(targetUrl, {
        method,
        headers: requestHeaders,
        body,
        redirect: "manual",
    })

    const contentType = backendRes.headers.get("content-type") ?? ""
    const isJson = contentType.includes("application/json")

    let payload: unknown = null
    let rawText: string | null = null

    if (isJson) {
        try {
            payload = await backendRes.json()
        } catch {
            payload = null
        }
    } else {
        rawText = await backendRes.text()
    }

    const response = NextResponse.json(payload ?? {}, {
        status: backendRes.status,
    })

    // For non-JSON, return text response.
    if (!isJson) {
        return new NextResponse(rawText ?? "", {
            status: backendRes.status,
            headers: {
                "content-type": contentType || "text/plain; charset=utf-8",
            },
        })
    }

    // If backend returns tokens (login/refresh), store them in HttpOnly cookies.
    const tokens =
        typeof payload === "object" && payload !== null && "tokens" in payload
            ? (payload as { tokens?: { accessToken?: string; refreshToken?: string } }).tokens
            : undefined

    if (tokens?.accessToken) {
        const isProd = process.env.NODE_ENV === "production"

        response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
        })

        if (tokens.refreshToken) {
            const refreshCookieName = path[0] === "staff-auth" ? STAFF_REFRESH_COOKIE : USER_REFRESH_COOKIE
            response.cookies.set(refreshCookieName, tokens.refreshToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: "lax",
                path: "/",
            })
        }
    }

    return response
}

export async function GET(request: Request, context: RouteContext) {
    return proxy(request, context)
}

export async function POST(request: Request, context: RouteContext) {
    return proxy(request, context)
}

export async function PUT(request: Request, context: RouteContext) {
    return proxy(request, context)
}

export async function PATCH(request: Request, context: RouteContext) {
    return proxy(request, context)
}

export async function DELETE(request: Request, context: RouteContext) {
    return proxy(request, context)
}
