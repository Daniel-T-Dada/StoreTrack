"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type Crumb = { href: string; label: string; isCurrent?: boolean }

const LABELS: Record<string, string> = {
    products: "Products",
    staff: "Staff",
    sales: "Sales",
    history: "History",
    reports: "Reports",
    create: "Create",
}

function labelForSegment(segment: string, previous?: string) {
    if (LABELS[segment]) return LABELS[segment]

    const isIdLike = /^[a-f\d]{24}$/i.test(segment)
    if (isIdLike) {
        if (previous === "products") return "Edit"
        if (previous === "staff") return "Details"
        return "Details"
    }

    return segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function DashboardBreadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname() ?? "/"

    const segments = pathname.split("/").filter(Boolean)

    const crumbs: Crumb[] = [{ href: "/", label: "Dashboard" }]

    let href = ""
    segments.forEach((segment, index) => {
        href += `/${segment}`
        const previous = index > 0 ? segments[index - 1] : undefined
        crumbs.push({ href, label: labelForSegment(segment, previous) })
    })

    if (crumbs.length) crumbs[crumbs.length - 1].isCurrent = true

    return (
        <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
            <ol className="flex flex-wrap items-center gap-1">
                {crumbs.map((crumb, index) => (
                    <li key={crumb.href} className="flex items-center gap-1">
                        {index > 0 ? <span aria-hidden className="select-none">/</span> : null}
                        {crumb.isCurrent ? (
                            <span className="text-foreground" aria-current="page">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link href={crumb.href} className="hover:text-foreground">
                                {crumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
