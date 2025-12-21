// app/(auth)/reset-password/page.tsx
"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { api } from "@/lib/api"
import { toast } from "sonner"
import { z } from "zod"
import { AuthForm } from "@/components/auth/AuthForm"
import type { AxiosError } from "axios"

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
})

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading…</div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  )
}

function ResetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") // Assuming /reset-password?token=abc123

  const handleResetPassword = async (values: { password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      if (!token) {
        toast.error("Missing reset token")
        return
      }

      await api.post(`/auth/reset-password/${token}`, {
        password: values.password,
      })
      toast.success("Password reset successful! Please login.")
      router.push("/signin")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      toast.error(axiosErr.response?.data?.message || "Failed to reset password")
    }
  }

  return (
    <AuthForm
      title="Reset Password"
      submitLabel="Reset Password"
      initialValues={{ password: "", confirmPassword: "" }}
      schema={resetPasswordSchema}
      onSubmit={handleResetPassword}
    />
  )
}
