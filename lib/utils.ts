import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type MoneyInput = number | string | null | undefined

type FormatNairaOptions = {
  withSymbol?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function formatNaira(value: MoneyInput, options?: FormatNairaOptions) {
  const num = typeof value === "number" ? value : Number(value)
  const withSymbol = options?.withSymbol ?? true
  const minimumFractionDigits = options?.minimumFractionDigits ?? 0
  const maximumFractionDigits = options?.maximumFractionDigits ?? 2

  if (!Number.isFinite(num)) {
    return withSymbol ? "₦0" : "0"
  }

  const formatted = new Intl.NumberFormat("en-NG", {
    style: withSymbol ? "currency" : "decimal",
    currency: "NGN",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num)

  return formatted
}
