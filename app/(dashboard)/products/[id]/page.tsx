

"use client"

import { ProductForm } from "@/components/ProductForm"
import { useUpdateProduct, useProducts } from "@/hooks/useProducts"
import { useMe } from "@/hooks/useMe"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductPage() {
    const { data: me, isLoading: meLoading } = useMe()
    const { id } = useParams()
    const router = useRouter()
    const { data, isLoading } = useProducts()

    const canManage = !!me && ["admin", "manager"].includes(me.role)

    useEffect(() => {
        if (!meLoading && me?.role && !canManage) {
            router.replace("/products")
        }
    }, [meLoading, me?.role, canManage, router])

    const product = data?.find((p) => p._id === id)
    const updateProduct = useUpdateProduct(id as string)

    if (me?.role && !canManage) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Edit Product</h2>
                    <p className="text-sm text-muted-foreground">Redirecting…</p>
                </div>
            </div>
        )
    }

    if (meLoading || isLoading || !product) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Edit Product</h2>
                    <p className="text-sm text-muted-foreground">Loading product details…</p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Edit Product</h2>
                <p className="text-sm text-muted-foreground">
                    Update product information and stock levels.
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        defaultValues={product}
                        loading={updateProduct.isPending}
                        onSubmit={(data) => {
                            if (!canManage) {
                                toast.error("You don’t have permission to update products")
                                return
                            }

                            const price = Number(data.price)
                            const costPrice = Number(data.costPrice)
                            const quantity = data.quantity.trim() === "" ? 0 : Number(data.quantity)
                            const lowStockThreshold =
                                data.lowStockThreshold.trim() === "" ? 0 : Number(data.lowStockThreshold)

                            if (!Number.isFinite(price) || price < 0) {
                                toast.error("Selling price must be a valid number")
                                return
                            }
                            if (!Number.isFinite(costPrice) || costPrice < 0) {
                                toast.error("Cost price must be a valid number")
                                return
                            }
                            if (!Number.isFinite(quantity) || quantity < 0) {
                                toast.error("Quantity must be a valid number")
                                return
                            }
                            if (!Number.isFinite(lowStockThreshold) || lowStockThreshold < 0) {
                                toast.error("Low stock threshold must be a valid number")
                                return
                            }

                            const payload = {
                                name: data.name,
                                sku: data.sku.trim() ? data.sku.trim() : undefined,
                                barcode: data.barcode.trim() ? data.barcode.trim() : undefined,
                                price,
                                costPrice,
                                quantity,
                                lowStockThreshold,
                            }

                            updateProduct.mutate(payload, {
                                onSuccess: () => {
                                    toast.success("Product updated")
                                    router.push("/products")
                                },
                                onError: () => toast.error("Update failed"),
                            })
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
