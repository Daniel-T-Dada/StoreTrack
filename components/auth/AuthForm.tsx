// components/AuthForm.tsx
"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ZodError, ZodSchema } from "zod"

interface AuthFormProps<T> {
  title: string
  submitLabel: string
  initialValues: T
  schema?: ZodSchema<T>
  onSubmit: (values: T) => Promise<void>
}

export function AuthForm<T extends Record<string, unknown>>({
  title,
  submitLabel,
  initialValues,
  schema,
  onSubmit,
}: AuthFormProps<T>) {
  const [values, setValues] = useState(initialValues)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (schema) {
      try {
        schema.parse(values) // validate
      } catch (err: unknown) {
        if (err instanceof ZodError) {
          toast.error(err.issues?.[0]?.message || "Invalid input")
        } else {
          toast.error("Invalid input")
        }
        return
      }
    }

    setLoading(true)
    try {
      await onSubmit(values)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const labelForKey = (key: string) =>
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())

  const inputTypeForKey = (key: string) => {
    const lower = key.toLowerCase()
    if (lower.includes("password")) return "password"
    if (lower.includes("email")) return "email"
    return "text"
  }

  const autoCompleteForKey = (key: string) => {
    const lower = key.toLowerCase()
    if (lower === "email") return "email"
    if (lower === "password") return "current-password"
    if (lower.includes("password")) return "new-password"
    return "on"
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(initialValues).map((key) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key}>{labelForKey(key)}</Label>
              <Input
                id={key}
                name={key}
                type={inputTypeForKey(key)}
                autoComplete={autoCompleteForKey(key)}
                value={String(values[key] ?? "")}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
            {loading ? "Please wait..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
