

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { SalesListResponse } from "@/types/api"

type CreateSaleResponse = {
    _id: string
    transactionId?: string
    product: string
    staff: string
    quantity: number
    totalPrice: number
    createdAt?: string
    updatedAt?: string
}

export const useCreateSale = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            product: string
            staff?: string
            quantity: number
        }) => (await api.post<CreateSaleResponse>("/sales", data)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
            qc.invalidateQueries({ queryKey: ["sales"] })
        },
    })
}

type UseSalesOptions = {
    staffId?: string
    enabled?: boolean
}

export const useSales = (options?: UseSalesOptions) =>
    useQuery<SalesListResponse>({
        queryKey: ["sales", { staffId: options?.staffId ?? null }],
        queryFn: async () =>
            (
                await api.get<SalesListResponse>("/sales", {
                    params: options?.staffId ? { staff: options.staffId } : undefined,
                })
            ).data,
        enabled: options?.enabled,
    })
