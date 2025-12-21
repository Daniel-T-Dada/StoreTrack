"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMe } from "@/hooks/useMe"
import { formatNaira } from "@/lib/utils"
import {
    useLowStock,
    useProfit,
    useProfitByProduct,
    useProfitByStaff,
    useTotalSales,
} from "@/hooks/useReports"

export default function ReportsPage() {
    const { data: me } = useMe()

    const isAllowed = !!me && ["admin", "manager"].includes(me.role)

    const totalSales = useTotalSales({ enabled: isAllowed })
    const profit = useProfit({ enabled: isAllowed })
    const lowStock = useLowStock({ enabled: isAllowed })
    const profitByProduct = useProfitByProduct({ enabled: isAllowed })
    const profitByStaff = useProfitByStaff({ enabled: isAllowed })

    if (me?.role && !isAllowed) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Reports</h2>
                    <p className="text-sm text-muted-foreground">Access denied.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Reports</h2>
                <p className="text-sm text-muted-foreground">Analytics and insights for your store.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {totalSales.isLoading ? (
                            <Skeleton className="h-6 w-48" />
                        ) : (
                            <div className="text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Transactions</span>
                                    <span className="font-medium">{totalSales.data?.totalTransactions ?? 0}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Total Sales</span>
                                    <span className="font-medium">{formatNaira(totalSales.data?.totalSales)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Revenue</span>
                                    <span className="font-medium">{formatNaira(totalSales.data?.totalRevenue)}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Profit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {profit.isLoading ? (
                            <Skeleton className="h-6 w-48" />
                        ) : (
                            <div className="text-sm">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Revenue</span>
                                    <span className="font-medium">{formatNaira(profit.data?.revenue)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Cost</span>
                                    <span className="font-medium">{formatNaira(profit.data?.cost)}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-muted-foreground">Profit</span>
                                    <span className="font-medium">{formatNaira(profit.data?.profit)}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Profit by Product</CardTitle>
                </CardHeader>
                <CardContent>
                    {profitByProduct.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profitByProduct.data?.length ? (
                                    profitByProduct.data.map((row) => (
                                        <TableRow key={row.productId}>
                                            <TableCell className="font-medium">{row.productName}</TableCell>
                                            <TableCell className="text-right">{formatNaira(row.revenue)}</TableCell>
                                            <TableCell className="text-right">{formatNaira(row.profit)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                            No data yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Profit by Staff</CardTitle>
                </CardHeader>
                <CardContent>
                    {profitByStaff.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Staff</TableHead>
                                    <TableHead className="text-right">Items Sold</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {profitByStaff.data?.length ? (
                                    profitByStaff.data.map((row) => (
                                        <TableRow key={row.staffId}>
                                            <TableCell className="font-medium">{row.staffName}</TableCell>
                                            <TableCell className="text-right">{row.totalItemsSold}</TableCell>
                                            <TableCell className="text-right">{formatNaira(row.totalSalesAmount)}</TableCell>
                                            <TableCell className="text-right">{formatNaira(row.totalProfit)}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                            No data yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Low Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    {lowStock.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Threshold</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowStock.data?.length ? (
                                    lowStock.data.map((p) => (
                                        <TableRow key={p._id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-right">{p.quantity}</TableCell>
                                            <TableCell className="text-right">{p.lowStockThreshold}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                                            No low-stock items.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
