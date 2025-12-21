"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { useStaff, useDeleteStaff } from "@/hooks/useStaff"
import { useMe } from "@/hooks/useMe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StaffDetailsPage() {
    const params = useParams<{ id: string }>()
    const id = params?.id ?? ""
    const router = useRouter()

    const { data: me } = useMe()
    const { data: staff = [], isLoading } = useStaff()
    const del = useDeleteStaff()

    const staffMember = useMemo(() => staff.find((s) => s._id === id), [staff, id])

    if (me?.role && !["admin", "manager"].includes(me.role)) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Staff</h2>
                    <p className="text-sm text-muted-foreground">Access denied.</p>
                </div>
            </div>
        )
    }

    if (!id) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Staff</h2>
                    <p className="text-sm text-muted-foreground">Invalid staff ID.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight">Staff Details</h2>
                        <p className="text-sm text-muted-foreground">Loading staff…</p>
                    </div>
                    <Button asChild variant="outline" className="shrink-0">
                        <Link href="/staff">Back</Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!staffMember) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight">Staff Details</h2>
                        <p className="text-sm text-muted-foreground">Staff member not found.</p>
                    </div>
                    <Button asChild variant="outline" className="shrink-0">
                        <Link href="/staff">Back</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Staff Details</h2>
                    <p className="text-sm text-muted-foreground">View staff profile information.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="shrink-0">
                        <Link href="/staff">Back</Link>
                    </Button>
                    {me?.role === "admin" ? (
                        <Button
                            variant="destructive"
                            className="shrink-0"
                            disabled={del.isPending}
                            aria-busy={del.isPending}
                            onClick={() => {
                                del.mutate(staffMember._id, {
                                    onSuccess: () => {
                                        toast.success("Staff removed")
                                        router.push("/staff")
                                    },
                                    onError: () => toast.error("Failed to delete staff"),
                                })
                            }}
                        >
                            Delete
                        </Button>
                    ) : null}
                </div>
            </div>

            <Card className="max-w-2xl">
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-muted-foreground">Name</div>
                        <div className="font-medium truncate">{staffMember.name}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-muted-foreground">Email</div>
                        <div className="font-medium truncate">{staffMember.email ?? "—"}</div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-muted-foreground">Role</div>
                        <div className="font-medium">{staffMember.role}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
