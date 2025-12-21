import { useQuery } from "@tanstack/react-query"
import { api } from "../lib/api"
import type {
  ProfitReport,
  ProfitByProductReport,
  ProfitByStaffReport,
  SalesByStaffReport,
  TotalSalesReport,
  Product,
} from "../types/api"

type QueryOptions = {
  enabled?: boolean
}

const fetchTotalSales = async () => {
  const res = await api.get<TotalSalesReport>("/reports/total-sales")
  return res.data
}

const fetchSalesByStaff = async () => {
  const res = await api.get<SalesByStaffReport[]>("/reports/sales-by-staff")
  return res.data
}

const fetchLowStock = async () => {
  const res = await api.get<Product[]>("/reports/low-stock")
  return res.data
}

const fetchProfit = async () => {
  const res = await api.get<ProfitReport>("/reports/profit")
  return res.data
}

const fetchProfitByProduct = async () => {
  const res = await api.get<ProfitByProductReport[]>("/reports/profit-by-product")
  return res.data
}

const fetchProfitByStaff = async () => {
  const res = await api.get<ProfitByStaffReport[]>("/reports/profit-by-staff")
  return res.data
}

// Total Sales
export const useTotalSales = (options?: QueryOptions) => {
  return useQuery<TotalSalesReport, Error>({
    queryKey: ["totalSales"],
    queryFn: fetchTotalSales,
    enabled: options?.enabled,
  });
};

// Sales by Staff
export const useSalesByStaff = (options?: QueryOptions) => {
  return useQuery<SalesByStaffReport[], Error>({
    queryKey: ["salesByStaff"],
    queryFn: fetchSalesByStaff,
    enabled: options?.enabled,
  });
};

// Low Stock
export const useLowStock = (options?: QueryOptions) => {
  return useQuery<Product[], Error>({
    queryKey: ["lowStock"],
    queryFn: fetchLowStock,
    enabled: options?.enabled,
  });
};

// Profit
export const useProfit = (options?: QueryOptions) => {
  return useQuery<ProfitReport, Error>({
    queryKey: ["profit"],
    queryFn: fetchProfit,
    enabled: options?.enabled,
  });
};

export const useProfitByProduct = (options?: QueryOptions) => {
  return useQuery<ProfitByProductReport[], Error>({
    queryKey: ["profitByProduct"],
    queryFn: fetchProfitByProduct,
    enabled: options?.enabled,
  })
}

export const useProfitByStaff = (options?: QueryOptions) => {
  return useQuery<ProfitByStaffReport[], Error>({
    queryKey: ["profitByStaff"],
    queryFn: fetchProfitByStaff,
    enabled: options?.enabled,
  })
}
