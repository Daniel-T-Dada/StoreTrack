"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import AppSidebar from "@/components/AppSidebar"
import { Header } from "@/components/Header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardBreadcrumbs } from "@/components/DashboardBreadcrumbs"

const AUTH_ROUTES = new Set(["/signin", "/signup", "/forgot-password", "/reset-password", "/verify-otp"])

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthRoute = pathname ? AUTH_ROUTES.has(pathname) : false

    if (isAuthRoute) {
        return (
            <main className="h-svh overflow-y-auto bg-muted/40 p-6">
                <div className="flex min-h-full items-center justify-center">{children}</div>
            </main>
        )
    }

    return (
        <SidebarProvider className="h-svh overflow-hidden">
            <AppSidebar />
            <div className="flex h-full flex-1 min-w-0 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
                    <div className="mx-auto w-full max-w-6xl space-y-4">
                        <DashboardBreadcrumbs />
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
