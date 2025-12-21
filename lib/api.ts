import axios from "axios"
import type { AxiosError, InternalAxiosRequestConfig } from "axios"

// Frontend should call our Next.js proxy (same-origin). The proxy talks to the real backend
// and stores tokens in HttpOnly cookies.
const API_BASE_URL = "/api/proxy"

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 🔑 REQUIRED
})

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }
        const originalRequest = error.config as RetriableConfig | undefined

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Cookie-based refresh. We try staff refresh first, then user refresh.
                try {
                    await api.post("/staff-auth/refresh")
                    return api(originalRequest)
                } catch {
                    await api.post("/auth/refresh")
                    return api(originalRequest)
                }
            } catch {
                if (typeof window !== "undefined") {
                    try {
                        await fetch("/api/auth/logout", { method: "POST" })
                    } catch {
                        // ignore
                    }
                    window.location.href = "/signin"
                }
            }
        }

        return Promise.reject(error)
    }
)