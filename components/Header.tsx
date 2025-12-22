"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useMe } from "@/hooks/useMe"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMemo } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export function Header() {
    const { data: me, isLoading: meLoading } = useMe()

    const initials = useMemo(() => {
        const raw = (me?.name ?? "").trim()
        if (!raw) return "?"
        const parts = raw.split(/\s+/).filter(Boolean)
        const first = parts[0]?.[0] ?? "?"
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
        return (first + last).toUpperCase()
    }, [me?.name])

    return (
        <header className="sticky top-0 z-20 border-b bg-background px-6">
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <SidebarTrigger className="shrink-0" />
                    <div className="min-w-0 flex-1">
                        {meLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="hidden h-3 w-32 sm:block" />
                            </div>
                        ) : (
                            <>
                                <h1 className="text-lg font-bold tracking-tight truncate">
                                    {`Welcome, ${me?.name ?? ""}`}
                                </h1>
                                <p className="hidden text-xs text-muted-foreground truncate sm:block">
                                    {`Role: ${me?.role ?? ""}`}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/profile" className="rounded-full" aria-label="Open profile">
                        <Avatar>
                            <AvatarImage src={me?.profileImage ?? undefined} alt={me?.name ?? "Profile"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>
            </div>
        </header>
    )
}
