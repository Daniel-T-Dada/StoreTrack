

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { MeResponse } from "@/types/api"

export const useMe = () => {
  return useQuery<MeResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/auth/me")
      return res.data
    },
    retry: false, // important: don't loop on 401
  })
}
