"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select"
import { toast } from "sonner"
import type { Product, Staff } from "@/types/api"

export type SalesFormValues = {
    product: string
    staff?: string
    quantity: number
}

type SalesFormProps = {
    products: Product[]
    staff?: Staff[]
    defaultStaff?: string
    loading?: boolean
    onSubmit: (data: SalesFormValues, reset: () => void) => void | Promise<void>
}

export function SalesForm({
    products,
    staff = [],
    defaultStaff,
    loading,
    onSubmit,
}: SalesFormProps) {
    const { register, handleSubmit, setValue, control, reset } = useForm<SalesFormValues>({
        defaultValues: {
            product: "",
            staff: defaultStaff ?? "",
            quantity: 1,
        },
    })

    useEffect(() => {
        if (defaultStaff) setValue("staff", defaultStaff)
    }, [defaultStaff, setValue])

    const productId = useWatch({ control, name: "product" })
    const quantity = useWatch({ control, name: "quantity" }) || 0

    const selectedProduct = products.find((p) => p._id === productId)
    const total = selectedProduct ? selectedProduct.price * quantity : 0

    const isLowStock =
        !!selectedProduct &&
        Number.isFinite(selectedProduct.quantity) &&
        Number.isFinite(selectedProduct.lowStockThreshold) &&
        selectedProduct.quantity <= selectedProduct.lowStockThreshold

    const disabled = !!loading

    // ✅ THIS IS THE IMPORTANT PART
    const handleSale = (data: SalesFormValues) => {
        if (!selectedProduct) return

        // Backend requires staff for admin/manager sales.
        if (staff.length > 0 && !data.staff) {
            toast.error("Please select a staff member")
            return
        }

        if (selectedProduct.quantity <= 0) {
            toast.error("This product is out of stock")
            return
        }

        if (quantity > selectedProduct.quantity) {
            toast.error("Insufficient stock")
            return
        }

        onSubmit(data, reset)
    }

    return (
        <form onSubmit={handleSubmit(handleSale)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <Label htmlFor="sale-product">Product</Label>
                    <input type="hidden" {...register("product")} />
                    <Select
                        onValueChange={(value) =>
                            setValue("product", value, { shouldDirty: true })
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger id="sale-product">
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p._id} value={p._id} disabled={p.quantity <= 0}>
                                    {p.name} (₦{p.price}){p.quantity <= 0 ? " — out of stock" : ""}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProduct ? (
                    <div className="sm:col-span-2 rounded-md border bg-background p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-medium">{selectedProduct.name}</div>
                            <div className="text-muted-foreground">Unit: ₦{selectedProduct.price.toLocaleString()}</div>
                        </div>
                        <div className="mt-2 grid gap-1 sm:grid-cols-3">
                            <div className="flex items-center justify-between gap-3 sm:block sm:space-y-0">
                                <span className="text-muted-foreground">In stock</span>
                                <span className="font-medium sm:ml-2">{selectedProduct.quantity}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:block sm:space-y-0">
                                <span className="text-muted-foreground">Low-stock threshold</span>
                                <span className="font-medium sm:ml-2">{selectedProduct.lowStockThreshold}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 sm:block sm:space-y-0">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium sm:ml-2">
                                    {selectedProduct.quantity <= 0
                                        ? "Out of stock"
                                        : isLowStock
                                            ? "Low stock"
                                            : "OK"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div>
                    <Label htmlFor="sale-quantity">Quantity</Label>
                    <Input
                        id="sale-quantity"
                        type="number"
                        min={1}
                        max={selectedProduct?.quantity ?? undefined}
                        step={1}
                        inputMode="numeric"
                        disabled={disabled}
                        {...register("quantity", { valueAsNumber: true })}
                    />
                </div>

                {staff.length ? (
                    <div>
                        <Label htmlFor="sale-staff">Staff</Label>
                        <input type="hidden" {...register("staff")} />
                        <Select
                            defaultValue={defaultStaff}
                            onValueChange={(value) =>
                                setValue("staff", value, { shouldDirty: true })
                            }
                            disabled={disabled}
                        >
                            <SelectTrigger id="sale-staff">
                                <SelectValue placeholder="Select staff" />
                            </SelectTrigger>
                            <SelectContent>
                                {staff.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                ) : null}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-lg font-semibold">₦{total.toLocaleString()}</div>
            </div>

            <div className="flex items-center justify-end">
                <Button type="submit" disabled={disabled || total === 0} aria-busy={disabled}>
                    {disabled ? "Processing..." : "Complete Sale"}
                </Button>
            </div>
        </form>
    )
}
