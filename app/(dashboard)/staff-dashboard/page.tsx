"use client"

import Link from "next/link"
import { useMe } from "@/hooks/useMe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StaffDashboardPage() {
    const { data: me, isLoading } = useMe()

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Staff Dashboard</h2>
                    <p className="text-sm text-muted-foreground">Loading…</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Sales</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-9 w-32" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-9 w-40" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="py-4">
                            <CardTitle className="text-base">Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-9 w-36" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const isStaff = me?.userType === "staff" || me?.role === "staff"

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Staff Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                    {isStaff ? "Quick actions for daily operations." : "This page is intended for staff users."}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="flex flex-col">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">New Checkout</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                        <p>Record a sale using the cart-based checkout.</p>
                        <div className="mt-auto pt-2">
                            <Button asChild size="sm" className="w-full">
                                <Link href="/sales">Go to Sales</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Transaction History</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                        <p>View your recent transactions and receipts.</p>
                        <div className="mt-auto pt-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href="/sales/history">View History</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Products</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                        <p>Browse inventory (editing is restricted).</p>
                        <div className="mt-auto pt-2">
                            <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href="/products">View Products</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
