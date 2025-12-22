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
  description?: string
  submitLabel: string
  initialValues: T
  schema?: ZodSchema<T>
  onSubmit: (values: T) => Promise<void>
  fields?: Record<
    string,
    {
      label?: string
      placeholder?: string
      type?: React.ComponentProps<typeof Input>["type"]
      autoComplete?: string
      inputMode?: React.ComponentProps<typeof Input>["inputMode"]
    }
  >
  passwordAutoComplete?: "current-password" | "new-password"
  footer?: React.ReactNode
}

export function AuthForm<T extends Record<string, unknown>>({
  title,
  description,
  submitLabel,
  initialValues,
  schema,
  onSubmit,
  fields,
  passwordAutoComplete,
  footer,
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
    if (lower === "password") return passwordAutoComplete ?? "current-password"
    if (lower.includes("password")) return "new-password"
    return "on"
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(initialValues).map((key) => {
              const meta = fields?.[key]

              return (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>{meta?.label ?? labelForKey(key)}</Label>
                  <Input
                    id={key}
                    name={key}
                    type={meta?.type ?? inputTypeForKey(key)}
                    inputMode={meta?.inputMode}
                    placeholder={meta?.placeholder}
                    autoComplete={meta?.autoComplete ?? autoCompleteForKey(key)}
                    value={String(values[key] ?? "")}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
            })}

            <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
              {loading ? "Please wait..." : submitLabel}
            </Button>
          </form>
        </CardContent>
      </Card>

      {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
    </div>
  )
}
