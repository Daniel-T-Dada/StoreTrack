

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Staff } from "@/types/api"

export type StaffInput = {
    name: string
    email: string
    role: string
    password: string
}

type UseStaffOptions = {
    enabled?: boolean
}

export const useStaff = (options?: UseStaffOptions) =>
    useQuery<Staff[]>({
        queryKey: ["staff"],
        queryFn: async () => (await api.get("/staff")).data as Staff[],
        enabled: options?.enabled ?? true,
    })

export const useCreateStaff = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: StaffInput) => api.post("/staff", data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
    })
}

export const useDeleteStaff = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => api.delete(`/staff/${id}`),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
    })
}
