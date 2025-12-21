// app/(auth)/register/page.tsx
"use client"

import { useRouter } from "next/navigation"

import { api } from "@/lib/api"
import { toast } from "sonner"
import { z } from "zod"
import { AuthForm } from "@/components/auth/AuthForm"
import type { AxiosError } from "axios"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  store: z.string().min(1, "Store is required"),
})

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = async (values: { name: string; email: string; password: string; store: string }) => {
    try {
      await api.post("/auth/register", values)
      toast.success("Account created! Please login.")
      router.push("/signin")
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>
      toast.error(axiosErr.response?.data?.message || "Registration failed")
    }
  }

  return (
    <AuthForm
      title="Sign Up"
      submitLabel="Register"
      initialValues={{ name: "", email: "", password: "", store: "" }}
      schema={registerSchema}
      onSubmit={handleRegister}
    />
  )
}
