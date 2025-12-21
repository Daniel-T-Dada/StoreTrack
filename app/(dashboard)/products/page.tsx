

"use client"

import { useProducts, useDeleteProduct } from "@/hooks/useProducts"
import { useMe } from "@/hooks/useMe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

export default function ProductsPage() {
    const { data: me } = useMe()
    const { data = [], isLoading } = useProducts()
    const deleteProduct = useDeleteProduct()

    const canManage = !!me && ["admin", "manager"].includes(me.role)

    const isEmpty = !isLoading && data.length === 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Products</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage inventory items and stock levels.
                    </p>
                </div>
                {canManage ? (
                    <Button asChild className="shrink-0">
                        <Link href="/products/create">Add Product</Link>
                    </Button>
                ) : null}
            </div>

            <Card>
                <CardHeader className="py-4">
                    <CardTitle className="text-base">All Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
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
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    {canManage ? (
                                        <TableHead className="text-right">Actions</TableHead>
                                    ) : null}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {isEmpty ? (
                                    <TableRow>
                                        <TableCell colSpan={canManage ? 4 : 3} className="py-10 text-center text-muted-foreground">
                                            No products yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((p) => (
                                        <TableRow key={p._id}>
                                            <TableCell className="font-medium">{p.name}</TableCell>
                                            <TableCell className="text-right">{p.price}</TableCell>
                                            <TableCell className="text-right">{p.quantity}</TableCell>
                                            {canManage ? (
                                                <TableCell className="text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Button asChild size="sm" variant="outline">
                                                            <Link href={`/products/${p._id}`}>Edit</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => {
                                                                deleteProduct.mutate(p._id, {
                                                                    onSuccess: () => toast.success("Deleted"),
                                                                })
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            ) : null}
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
