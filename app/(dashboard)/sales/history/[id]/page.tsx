"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { useTransactionReceipt } from "@/hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatNaira } from "@/lib/utils"

export default function TransactionDetailsPage() {
    const params = useParams()
    const id = String(params?.id ?? "").trim()

    const receipt = useTransactionReceipt(id, { enabled: !!id })

    const isLoading = receipt.isLoading
    const data = receipt.data

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Transaction</h2>
                    <p className="text-sm text-muted-foreground">Receipt-style view of the transaction.</p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                    <Link href="/sales/history">Back to History</Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-6 w-2/3" />
                            <Skeleton className="h-6 w-1/3" />
                        </div>
                    ) : data ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Transaction ID</div>
                                <div className="font-mono text-sm break-all">{data.transaction.id}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Staff</div>
                                <div className="text-sm">{data.transaction.staffName ?? "—"}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Date</div>
                                <div className="text-sm">
                                    {data.transaction.lastCreatedAt ? new Date(data.transaction.lastCreatedAt).toLocaleString() : "—"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Total</div>
                                <div className="text-lg font-semibold">{formatNaira(data.transaction.total)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center text-sm text-muted-foreground">Transaction not found.</div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Items</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : data ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item) => (
                                    <TableRow key={item.saleId}>
                                        <TableCell className="font-medium">
                                            <div className="truncate">{item.name}</div>
                                            {(item.sku || item.barcode) ? (
                                                <div className="text-xs text-muted-foreground">
                                                    {item.sku ? `SKU: ${item.sku}` : null}
                                                    {item.sku && item.barcode ? " • " : null}
                                                    {item.barcode ? `Barcode: ${item.barcode}` : null}
                                                </div>
                                            ) : null}
                                        </TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatNaira(item.unitPrice)}</TableCell>
                                        <TableCell className="text-right">{formatNaira(item.total)}</TableCell>
                                    </TableRow>
                                ))}

                                <TableRow>
                                    <TableCell className="text-right font-medium">Totals</TableCell>
                                    <TableCell className="text-right font-medium">{data.transaction.totalQuantity}</TableCell>
                                    <TableCell />
                                    <TableCell className="text-right font-medium">{formatNaira(data.transaction.total)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-10 text-center text-sm text-muted-foreground">No items.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
