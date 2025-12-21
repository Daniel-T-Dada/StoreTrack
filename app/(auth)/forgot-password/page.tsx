// app/(auth)/forgot-password/page.tsx
"use client"

import { useRouter } from "next/navigation"

import { api } from "@/lib/api"
import { toast } from "sonner"
import { z } from "zod"
import { AuthForm } from "@/components/auth/AuthForm"
import type { AxiosError } from "axios"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ForgotPasswordPage() {
  const router = useRouter()

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      const res = await api.post("/auth/forgot-password", values)
      const resetToken = (res.data as { resetToken?: string })?.resetToken

      // This backend implementation returns the token for easy integration/testing.
      // If present, take the user directly to the reset screen.
      if (resetToken) {
        toast.success("Reset token generated. Please set a new password.")
        router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`)
        return
      }

      toast.success("If the email exists, a reset link will be sent.")
      router.push("/signin")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      toast.error(axiosErr.response?.data?.message || "Failed to send reset link")
    }
  }

  return (
    <AuthForm
      title="Forgot Password"
      submitLabel="Send Reset Link"
      initialValues={{ email: "" }}
      schema={forgotPasswordSchema}
      onSubmit={handleForgotPassword}
    />
  )
}
