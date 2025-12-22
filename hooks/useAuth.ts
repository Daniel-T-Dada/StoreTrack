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

// Combined register + send OTP
export const useRegisterSendOtp = () => {
  return useMutation<{ message?: string; requiresEmailVerification?: boolean }, unknown, {
    name: string
    email: string
    password: string
    store: string
  }>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/register-send-otp", data)
      return res.data
    },
  })
}

// Verify OTP and log in (sets cookies and returns tokens/user)
export const useVerifyOtpLogin = () => {
  return useMutation<AuthResponse, unknown, { email: string; code: string }>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/verify-otp-login", data)
      return res.data
    },
  })
}

// Resend verification code
export const useResendVerification = () => {
  return useMutation<{ message?: string }, unknown, { email: string }>({
    mutationFn: async (data) => {
      const res = await api.post("/auth/resend-verification", data)
      return res.data
    },
  })
}

