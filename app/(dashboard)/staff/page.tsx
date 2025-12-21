

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useStaff, useDeleteStaff } from "@/hooks/useStaff"
import { toast } from "sonner"
import type { Staff } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMe } from "@/hooks/useMe"

export default function StaffPage() {
    const { data: me } = useMe()
    const { data = [], isLoading } = useStaff()
    const del = useDeleteStaff()

    const isEmpty = !isLoading && data.length === 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Staff</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage staff members and their roles.
                    </p>
                </div>
                <Button asChild className="shrink-0">
                    <Link href="/staff/create">Add Staff</Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">All Staff</CardTitle>
                </CardHeader>
                <CardContent>
                    {me?.role && !["admin", "manager"].includes(me.role) ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            You don’t have permission to view staff.
                        </div>
                    ) : isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isEmpty ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                            No staff members yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((s: Staff) => (
                                        <TableRow key={s._id}>
                                            <TableCell className="font-medium">{s.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{s.email ?? "—"}</TableCell>
                                            <TableCell>{s.role}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Button asChild size="sm" variant="outline">
                                                        <Link href={`/staff/${s._id}`}>View</Link>
                                                    </Button>
                                                    {me?.role === "admin" ? (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                del.mutate(s._id, {
                                                                    onSuccess: () => toast.success("Staff removed"),
                                                                })
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    ) : null}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
