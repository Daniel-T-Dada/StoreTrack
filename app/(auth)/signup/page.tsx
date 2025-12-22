// app/(auth)/register/page.tsx
"use client"

import { useRouter } from "next/navigation"

import { z } from "zod"
import { AuthForm } from "@/components/auth/AuthForm"
import type { AxiosError } from "axios"
import Link from "next/link"
import { useRegisterSendOtp } from "@/hooks/useAuth"
import { toast } from "sonner"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  store: z.string().min(1, "Store is required"),
})

export default function RegisterPage() {
  const router = useRouter()
  const registerSendOtp = useRegisterSendOtp()

  const handleRegister = async (values: { name: string; email: string; password: string; store: string }) => {
    try {
      await registerSendOtp.mutateAsync(values)
      toast.success("Account created. Check your email for the 6-digit code.")
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`)
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      toast.error(axiosErr.response?.data?.message || "Registration failed")
    }
  }

  return (
    <AuthForm
      title="Sign Up"
      description="Create a store owner account to set up your store and manage staff."
      submitLabel="Register"
      initialValues={{ name: "", email: "", password: "", store: "" }}
      schema={registerSchema}
      onSubmit={handleRegister}
      passwordAutoComplete="new-password"
      fields={{
        name: { label: "Full Name", placeholder: "Your name" },
        email: { placeholder: "you@company.com" },
        password: { placeholder: "Create a password (min 6 characters)" },
        store: { label: "Store Name", placeholder: "e.g. Main Branch" },
      }}
      footer={
        <div>
          Already have an account?{" "}
          <Link className="underline underline-offset-4" href="/signin">
            Sign in
          </Link>
        </div>
      }
    />
  )
}
