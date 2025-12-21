// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { api } from "../lib/api"
// import type { Product } from "../types/api"

// export const useProducts = () => {
//   const queryClient = useQueryClient()

//   const fetchProducts = useQuery({
//   queryKey: ["products"],
//   queryFn: async () => {
//     const res = await api.get("/products")
//     return res.data
//   },
// })


//  const addProduct = useMutation({
//   mutationFn: async (product: Partial<Product>) => {
//     const res = await api.post("/products", product)
//     return res.data
//   },
//   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
// })


//   const updateProduct = useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
//       const res = await api.put(`/products/${id}`, data)
//       return res.data
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
//   })

//   const deleteProduct = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await api.delete(`/products/${id}`)
//       return res.data
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
//   })

//   return { fetchProducts, addProduct, updateProduct, deleteProduct }
// }


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Product, ProductLookupResult } from "@/types/api"

export const useProducts = () =>
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products")
      return res.data
    },
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Product>) =>
      api.post("/products", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useUpdateProduct = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Product>) =>
      api.put(`/products/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] })
    },
  })
}

export const useProductSearch = (q: string, options?: { enabled?: boolean; limit?: number }) =>
  useQuery<ProductLookupResult[]>({
    queryKey: ["products-search", { q, limit: options?.limit ?? 20 }],
    queryFn: async () =>
      (
        await api.get<ProductLookupResult[]>("/products/search", {
          params: { q, limit: options?.limit ?? 20 },
        })
      ).data,
    enabled: (options?.enabled ?? true) && q.trim().length > 0,
  })

export const useProductLookup = (
  params: { sku?: string; barcode?: string },
  options?: { enabled?: boolean }
) =>
  useQuery<ProductLookupResult>({
    queryKey: ["products-lookup", { sku: params.sku ?? null, barcode: params.barcode ?? null }],
    queryFn: async () =>
      (
        await api.get<ProductLookupResult>("/products/lookup", {
          params,
        })
      ).data,
    enabled:
      (options?.enabled ?? true) &&
      (!!params.sku?.trim() || !!params.barcode?.trim()) &&
      !(params.sku && params.barcode),
  })
