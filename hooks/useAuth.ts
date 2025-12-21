import { useMutation } from "@tanstack/react-query"
import { api } from "../lib/api"
import type { AuthResponse } from "../types/api"

interface LoginInput {
  email: string
  password: string
}

export const useLogin = () => {
  return useMutation<AuthResponse, unknown, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post("/auth/login", data)
      return res.data
    },
  })
}

export type StaffAuthResponse = {
  staff: {
    id: string
    name: string
    role: string
    store?: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

export const useStaffLogin = () => {
  return useMutation<StaffAuthResponse, unknown, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const res = await api.post("/staff-auth/login", data)
      return res.data
    },
  })
}

