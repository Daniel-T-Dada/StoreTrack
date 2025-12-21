import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
    TransactionDetailsResponse,
    TransactionListResponse,
    TransactionReceiptResponse,
} from "@/types/api"

export type TransactionsListParams = {
    staff?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}

export const useTransactions = (params?: TransactionsListParams, options?: { enabled?: boolean }) =>
    useQuery<TransactionListResponse>({
        queryKey: ["transactions", params ?? {}],
        queryFn: async () =>
            (
                await api.get<TransactionListResponse>("/sales/transactions", {
                    params,
                })
            ).data,
        enabled: options?.enabled,
    })

export const useTransactionDetails = (transactionId: string, options?: { enabled?: boolean }) =>
    useQuery<TransactionDetailsResponse>({
        queryKey: ["transaction", transactionId],
        queryFn: async () => (await api.get<TransactionDetailsResponse>(`/sales/transactions/${transactionId}`)).data,
        enabled: options?.enabled,
    })

export const useTransactionReceipt = (transactionId: string, options?: { enabled?: boolean }) =>
    useQuery<TransactionReceiptResponse>({
        queryKey: ["transaction-receipt", transactionId],
        queryFn: async () =>
            (
                await api.get<TransactionReceiptResponse>(`/sales/transactions/${transactionId}/receipt`)
            ).data,
        enabled: options?.enabled,
    })

type CheckoutRequest = {
    items: Array<{ product: string; quantity: number }>
    staff?: string
    client?: {
        expectedTotal?: number
    }
}

type CheckoutResponse = {
    transaction: {
        id: string
        staff: string
        itemsCount: number
        total: number
        createdAt: string
    }
    sales: unknown[]
    validation: {
        clientExpectedTotal: number | null
        serverTotal: number
        matches: boolean | null
    }
}

export const useCheckout = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (payload: CheckoutRequest) => (await api.post<CheckoutResponse>("/sales/checkout", payload)).data,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["products"] })
            qc.invalidateQueries({ queryKey: ["transactions"] })
            qc.invalidateQueries({ queryKey: ["sales"] })
        },
    })
}
