
// ===== User =====
export interface User {
  _id: string
  name: string
  email: string
}

// Shape returned by GET /api/auth/me
export interface MeResponse {
  id: string
  name: string
  email: string | null
  role: string
  userType: "user" | "staff"
  storeId: string | null
  store: string | null
  profileImage?: string | null
}

// ===== PRODUCTS =====
export interface Product {
  _id: string
  name: string
  sku?: string
  barcode?: string
  price: number
  costPrice: number
  quantity: number
  lowStockThreshold: number
  isLowStock?: boolean
  description?: string
}

export type ProductLookupResult = {
  _id: string
  name: string
  price: number
  quantity: number
  sku?: string
  barcode?: string
}
// ===== Staff =====
export interface Staff {
  _id: string
  name: string
  email?: string
  role: string
}

// ===== SALES =====
export interface Sale {
  _id: string
  transactionId?: string
  product: Product
  staff: Staff
  quantity: number
  unitPrice?: number
  unitCostPrice?: number
  productNameSnapshot?: string
  totalPrice: number
  createdAt: string
}

export type ListMeta = {
  total: number
  limit: number
  page: number | null
  nextCursor?: string | null
}

export type SalesListResponse = {
  data: Sale[]
  meta: ListMeta
}

export type TransactionSummary = {
  id: string
  staff: string
  staffName?: string
  createdAt: string
  lastCreatedAt: string
  total: number
  itemsCount: number
  totalQuantity: number
}

export type TransactionListResponse = {
  data: TransactionSummary[]
  meta: {
    total: number
    limit: number
    page: number
  }
}

export type TransactionDetailsResponse = {
  transaction: {
    id: string
    staff: string
    staffName?: string
    itemsCount: number
    totalQuantity: number
    total: number
    createdAt: string
    lastCreatedAt: string
  }
  sales: Sale[]
}

export type TransactionReceiptItem = {
  saleId: string
  productId: string
  name: string
  sku: string | null
  barcode: string | null
  unitPrice: number
  quantity: number
  total: number
}

export type TransactionReceiptResponse = {
  transaction: {
    id: string
    createdAt: string
    lastCreatedAt: string
    staff: string
    staffName?: string
    itemsCount: number
    totalQuantity: number
    total: number
  }
  items: TransactionReceiptItem[]
}

// ===== AUTH =====
export interface AuthResponse {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

// ===== REPORTS =====

export interface TotalSalesReport {
  totalSales: number
  totalRevenue: number
  totalTransactions: number
}

export interface SalesByStaffReport {
  staffId: string
  staffName: string
  totalSales: number
  totalQuantity: number
}

export interface LowStockReport {
  // Backend returns full Product documents for low-stock.
  // Keep this type for compatibility, but prefer using `Product` directly.
  productId: string
  productName: string
  quantity: number
  lowStockThreshold: number
}

export interface ProfitReport {
  revenue: number
  cost: number
  profit: number
  margin: string
}

export interface ProfitByProductReport {
  productId: string
  productName: string
  revenue: number
  profit: number
}

export interface ProfitByStaffReport {
  staffId: string
  staffName: string
  totalProfit: number
  totalSalesAmount: number
  totalItemsSold: number
}

// ===== Charts Data =====
export interface ChartDatum {
  label: string
  value: number
}
