// app/(auth)/login/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { useLogin, useStaffLogin } from "@/hooks/useAuth"
import { AuthForm } from "@/components/auth/AuthForm"
import { toast } from "sonner"
import { z } from "zod"
import type { AxiosError } from "axios"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function SignInPage() {
  const router = useRouter()
  const staffLoginMutation = useStaffLogin()
  const loginMutation = useLogin()

  const getErrorMessage = (err: unknown) => {
    const axiosErr = err as AxiosError<{ message?: string }>
    return axiosErr.response?.data?.message
  }

  const getStatus = (err: unknown) => {
    const axiosErr = err as AxiosError
    return axiosErr.response?.status
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    // Try staff/manager login first. If it fails with invalid credentials,
    // fall back to owner login. This avoids a UI toggle while keeping errors generic.
    try {
      const staffData = await staffLoginMutation.mutateAsync(values)
      toast.success(`Welcome ${staffData.staff.name}`)
      router.push("/")
      return
    } catch (err: unknown) {
      const status = getStatus(err)
      const message = getErrorMessage(err)

      // Backend returns 400 for invalid credentials (including non-existent staff).
      // Only fall back for this case; otherwise surface the error.
      if (status && status !== 400) {
        toast.error(message || "Login failed")
        return
      }
    }

    try {
      const data = await loginMutation.mutateAsync(values)
      toast.success(`Welcome ${data.user.name}`)
      router.push("/")
    } catch (err: unknown) {
      const status = getStatus(err)
      const message = getErrorMessage(err)

      if (status === 403 && message?.toLowerCase().includes("email not verified")) {
        toast.message("Verify your email to continue", { description: "Enter the 6-digit code we sent to your email." })
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`)
        return
      }

      toast.error(message || "Invalid credentials")
    }
  }

  return (
    <AuthForm
      title="Sign In"
      description="Sign in to manage inventory, record sales, and view transactions."
      submitLabel="Login"
      initialValues={{ email: "", password: "" }}
      schema={loginSchema}
      onSubmit={handleLogin}
      passwordAutoComplete="current-password"
      fields={{
        email: { placeholder: "you@company.com" },
        password: { placeholder: "Enter your password" },
      }}
      footer={
        <div className="space-y-2">
          <div>
            <Link className="underline underline-offset-4" href="/forgot-password">
              Forgot your password?
            </Link>
          </div>
          <div>
            Don’t have an account?{" "}
            <Link className="underline underline-offset-4" href="/signup">
              Sign up
            </Link>
          </div>
        </div>
      }
    />
  )
}
