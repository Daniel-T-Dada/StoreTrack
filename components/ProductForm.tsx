"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { Product } from "@/types/api"

interface Props {
  defaultValues?: Partial<Product>
  onSubmit: (data: ProductFormValues) => void
  loading?: boolean
}

export type ProductFormValues = {
  name: string
  sku: string
  barcode: string
  price: string
  costPrice: string
  quantity: string
  lowStockThreshold: string
}

const FIELD_ORDER: Array<keyof ProductFormValues> = [
  "name",
  "sku",
  "barcode",
  "price",
  "costPrice",
  "quantity",
  "lowStockThreshold",
]

const labelForField: Record<keyof ProductFormValues, string> = {
  name: "Product Name",
  sku: "SKU (optional)",
  barcode: "Barcode (optional)",
  price: "Selling Price",
  costPrice: "Cost Price",
  quantity: "Quantity",
  lowStockThreshold: "Low Stock Threshold",
}

const inputPropsForField: Record<keyof ProductFormValues, React.ComponentProps<typeof Input>> = {
  name: { type: "text", autoComplete: "off" },
  sku: { type: "text", autoComplete: "off" },
  barcode: { type: "text", autoComplete: "off" },
  price: { type: "number", inputMode: "decimal", min: 0, step: "0.01" },
  costPrice: { type: "number", inputMode: "decimal", min: 0, step: "0.01" },
  quantity: { type: "number", inputMode: "numeric", min: 0, step: "1" },
  lowStockThreshold: { type: "number", inputMode: "numeric", min: 0, step: "1" },
}

export function ProductForm({ defaultValues, onSubmit, loading }: Props) {
  const [form, setForm] = useState<ProductFormValues>({
    name: defaultValues?.name ?? "",
    sku: defaultValues?.sku ?? "",
    barcode: defaultValues?.barcode ?? "",
    price: defaultValues?.price != null ? String(defaultValues.price) : "",
    costPrice: defaultValues?.costPrice != null ? String(defaultValues.costPrice) : "",
    quantity: defaultValues?.quantity != null ? String(defaultValues.quantity) : "",
    lowStockThreshold:
      defaultValues?.lowStockThreshold != null
        ? String(defaultValues.lowStockThreshold)
        : "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Product name is required")
      return
    }

    if (form.price.trim() === "" || form.costPrice.trim() === "") {
      toast.error("Selling price and cost price are required")
      return
    }

    const price = Number(form.price)
    const costPrice = Number(form.costPrice)
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(costPrice) || costPrice < 0) {
      toast.error("Selling price and cost price must be valid numbers")
      return
    }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELD_ORDER.map((key) => {
          const inputId = `product-${key}`
          const value = form[key]

          return (
            <div key={key} className={key === "name" ? "sm:col-span-2" : undefined}>
              <Label htmlFor={inputId}>{labelForField[key]}</Label>
              <Input
                id={inputId}
                value={value}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                disabled={loading}
                {...inputPropsForField[key]}
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  )
}
