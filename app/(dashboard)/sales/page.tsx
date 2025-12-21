"use client"

import { useProductSearch } from "@/hooks/useProducts"
import { useStaff } from "@/hooks/useStaff"
import { useCheckout } from "@/hooks/useTransactions"
import { toast } from "sonner"
import { useMe } from "@/hooks/useMe"
import type { ProductLookupResult, Staff } from "@/types/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo, useState } from "react"
import type { AxiosError } from "axios"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"

type CartItem = {
    product: ProductLookupResult
    quantity: number
}

const formatNaira = (value: unknown) => {
    const numberValue = typeof value === "number" ? value : Number(value)
    if (!Number.isFinite(numberValue)) return "0"
    return numberValue.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

export default function SalesPage() {
    const checkout = useCheckout()
    const { data: me, isLoading: meLoading } = useMe() // 🔑 get current user

    const isStaffUser = me?.userType === "staff" || me?.role === "staff"
    const staffQueryEnabled = !!me && !isStaffUser
    const { data: staff = [], isLoading: staffLoading } = useStaff({ enabled: staffQueryEnabled })
    const staffOptions = staffQueryEnabled ? (staff as Staff[]) : []

    const [staffId, setStaffId] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [lookupValue, setLookupValue] = useState<string>("")

    const [cart, setCart] = useState<Record<string, CartItem>>({})

    const search = useProductSearch(searchQuery, { enabled: !!me })

    const cartItems = useMemo(() => Object.values(cart), [cart])
    const totals = useMemo(() => {
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
        const expectedTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        return { totalQuantity, expectedTotal }
    }, [cartItems])

    const showSkeleton = meLoading || (staffQueryEnabled && staffLoading)

    const getErrorMessage = (err: unknown) => {
        type ErrorPayload = {
            message?: unknown
            errors?: Array<{ msg?: unknown }>
            details?: unknown
        }

        const axiosErr = err as AxiosError<ErrorPayload>
        const data = axiosErr.response?.data

        // express-validator format: { errors: [{ msg: "..." }, ...] }
        const validatorMsg = Array.isArray(data?.errors) ? data.errors?.[0]?.msg : null
        if (validatorMsg) return String(validatorMsg)

        if (data?.message) return String(data.message)
        return "Sale failed"
    }

    const addToCart = (product: ProductLookupResult, quantity = 1) => {
        const available = Number(product.quantity ?? 0)
        if (available <= 0) {
            toast.error("This product is out of stock")
            return
        }

        setCart((prev) => {
            const existing = prev[product._id]
            const nextQty = Math.min((existing?.quantity ?? 0) + quantity, available)
            return {
                ...prev,
                [product._id]: {
                    product,
                    quantity: nextQty,
                },
            }
        })
    }

    const setItemQuantity = (productId: string, quantity: number) => {
        setCart((prev) => {
            const existing = prev[productId]
            if (!existing) return prev
            const available = Number(existing.product.quantity ?? 0)
            const nextQty = Math.max(1, Math.min(quantity, Math.max(1, available)))
            return {
                ...prev,
                [productId]: {
                    ...existing,
                    quantity: nextQty,
                },
            }
        })
    }

    const removeItem = (productId: string) => {
        setCart((prev) => {
            const { [productId]: removed, ...rest } = prev
            void removed
            return rest
        })
    }

    const clearCart = () => setCart({})

    const lookupAndAdd = async () => {
        const raw = lookupValue.trim()
        if (!raw) {
            toast.error("Enter a SKU or barcode")
            return
        }

        const isNumeric = /^\d+$/.test(raw)

        try {
            const product = (
                await api.get<ProductLookupResult>("/products/lookup", {
                    params: isNumeric ? { barcode: raw } : { sku: raw },
                })
            ).data
            addToCart(product, 1)
            setLookupValue("")
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }

    const canCheckout = cartItems.length > 0 && (!staffQueryEnabled || !!staffId)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Sales</h2>
                    <p className="text-sm text-muted-foreground">
                        Build a cart and checkout (backend computes totals).
                    </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                    <Link href="/sales/history">View History</Link>
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Scan / Quick Lookup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {showSkeleton ? (
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-full" />
                                <div className="flex items-center justify-end">
                                    <Skeleton className="h-10 w-28" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="lookup">SKU or Barcode</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="lookup"
                                            value={lookupValue}
                                            onChange={(e) => setLookupValue(e.target.value)}
                                            placeholder="Scan barcode or enter SKU"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    lookupAndAdd()
                                                }
                                            }}
                                            disabled={checkout.isPending}
                                        />
                                        <Button onClick={lookupAndAdd} disabled={checkout.isPending || !lookupValue.trim()}>
                                            Add
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Numeric input is treated as barcode; otherwise SKU.
                                    </p>
                                </div>

                                {staffQueryEnabled ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="checkout-staff">Staff</Label>
                                        <Select value={staffId} onValueChange={setStaffId}>
                                            <SelectTrigger id="checkout-staff" className="w-full">
                                                <SelectValue placeholder="Select staff" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {staffOptions.map((s) => (
                                                    <SelectItem key={s._id} value={s._id}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="py-4">
                        <CardTitle className="text-base">Search Products</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {showSkeleton ? (
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name, SKU, or barcode"
                                        disabled={checkout.isPending}
                                    />
                                </div>

                                {search.isLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : searchQuery.trim() ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Product</TableHead>
                                                <TableHead className="text-right">Stock</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(search.data ?? []).length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                                        No products found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                (search.data ?? []).map((p) => (
                                                    <TableRow key={p._id}>
                                                        <TableCell className="font-medium">
                                                            <div className="truncate">{p.name}</div>
                                                            {(p.sku || p.barcode) ? (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {p.sku ? `SKU: ${p.sku}` : null}
                                                                    {p.sku && p.barcode ? " • " : null}
                                                                    {p.barcode ? `Barcode: ${p.barcode}` : null}
                                                                </div>
                                                            ) : null}
                                                        </TableCell>
                                                        <TableCell className="text-right">{p.quantity}</TableCell>
                                                        <TableCell className="text-right">₦{formatNaira(p.price)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => addToCart(p, 1)}
                                                                disabled={checkout.isPending || p.quantity <= 0}
                                                            >
                                                                Add
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        Start typing to search products.
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-base">Cart</CardTitle>
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            disabled={checkout.isPending || cartItems.length === 0}
                        >
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="py-10 text-center text-sm text-muted-foreground">
                            No items in cart.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Unit</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map(({ product, quantity }) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="font-medium">
                                            <div className="truncate">{product.name}</div>
                                            <div className="text-xs text-muted-foreground">In stock: {product.quantity}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                className="h-9 w-20 text-right"
                                                type="number"
                                                inputMode="numeric"
                                                min={1}
                                                max={product.quantity}
                                                step={1}
                                                value={quantity}
                                                disabled={checkout.isPending}
                                                onChange={(e) => setItemQuantity(product._id, Number(e.target.value) || 1)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">₦{formatNaira(product.price)}</TableCell>
                                        <TableCell className="text-right">₦{formatNaira(product.price * quantity)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => removeItem(product._id)}
                                                disabled={checkout.isPending}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                            Items: {cartItems.length} • Qty: {totals.totalQuantity}
                        </div>
                        <div className="text-lg font-semibold">₦{formatNaira(totals.expectedTotal)}</div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            onClick={() => {
                                if (!canCheckout) {
                                    toast.error(staffQueryEnabled ? "Please select a staff member" : "Add items to cart")
                                    return
                                }

                                checkout.mutate(
                                    {
                                        items: cartItems.map((i) => ({
                                            product: i.product._id,
                                            quantity: i.quantity,
                                        })),
                                        staff: staffQueryEnabled ? staffId : undefined,
                                        client: {
                                            expectedTotal: totals.expectedTotal,
                                        },
                                    },
                                    {
                                        onSuccess: (result) => {
                                            toast.success("Checkout completed")

                                            const matches = result?.validation?.matches
                                            if (matches === false) {
                                                toast.warning(
                                                    `Backend total (₦${formatNaira(result.validation.serverTotal)}) differs from UI total (₦${formatNaira(totals.expectedTotal)}).`
                                                )
                                            }

                                            clearCart()
                                            setSearchQuery("")
                                        },
                                        onError: (err) => toast.error(getErrorMessage(err)),
                                    }
                                )
                            }}
                            disabled={checkout.isPending || cartItems.length === 0}
                        >
                            {checkout.isPending ? "Processing..." : "Checkout"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
