"use client"

import { useCreateProduct } from "@/hooks/useProducts"
import { useMe } from "@/hooks/useMe"
import { toast } from "sonner"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductForm } from "@/components/ProductForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewProductPage() {
    const { data: me, isLoading: meLoading } = useMe()
    const createProduct = useCreateProduct()
    const router = useRouter()

    const canManage = !!me && ["admin", "manager"].includes(me.role)

    useEffect(() => {
        if (!meLoading && me?.role && !canManage) {
            router.replace("/products")
        }
    }, [meLoading, me?.role, canManage, router])

    if (me?.role && !canManage) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Add Product</h2>
                    <p className="text-sm text-muted-foreground">Redirecting…</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Add Product</h2>
                <p className="text-sm text-muted-foreground">
                    Create a new inventory item and set its stock levels.
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        loading={createProduct.isPending}
                        onSubmit={(data) => {
                            if (!canManage) {
                                toast.error("You don’t have permission to create products")
                                return
                            }

                            const payload = {
                                name: data.name,
                                sku: data.sku.trim() ? data.sku.trim() : undefined,
                                barcode: data.barcode.trim() ? data.barcode.trim() : undefined,
                                price: Number(data.price) || 0,
                                costPrice: Number(data.costPrice) || 0,
                                quantity: Number(data.quantity) || 0,
                                lowStockThreshold: Number(data.lowStockThreshold) || 0,
                            }

                            createProduct.mutate(payload, {
                                onSuccess: () => {
                                    toast.success("Product created")
                                    router.push("/products")
                                },
                                onError: () => toast.error("Failed to create product"),
                            })
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
