"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useResendVerification, useVerifyOtpLogin } from "@/hooks/useAuth"
import type { AxiosError } from "axios"

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
            <VerifyOtpInner />
        </Suspense>
    )
}

function VerifyOtpInner() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const initialEmail = searchParams?.get("email")?.trim() ?? ""
    const [email, setEmail] = useState<string>(initialEmail)
    const [code, setCode] = useState<string>("")

    const verifyOtp = useVerifyOtpLogin()
    const resend = useResendVerification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error("Enter the email you registered with")
            return
        }

        if (!code || code.length !== 6) {
            toast.error("Enter the 6-digit code")
            return
        }

        try {
            await verifyOtp.mutateAsync({ email, code })
            toast.success("Email verified. You’re now signed in.")
            router.push("/")
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<{ message?: string }>
            const message = axiosErr.response?.data?.message
            toast.error(message || "Verification failed")
        }
    }

    // Auto-submit when user finishes entering the 6-digit code.
    // Debounce slightly to avoid racing with fast typing or autofill.
    const autoSubmitTimer = useRef<number | null>(null)
    useEffect(() => {
        // don't attempt auto-submit while an explicit submit is in progress
        if (verifyOtp.isPending) return

        if (code && code.length === 6) {
            // ensure email exists before auto-submitting
            if (!email) return

            // small debounce to avoid accidental submits
            if (autoSubmitTimer.current) {
                window.clearTimeout(autoSubmitTimer.current)
            }
            autoSubmitTimer.current = window.setTimeout(async () => {
                try {
                    await verifyOtp.mutateAsync({ email, code })
                    toast.success("Email verified. You’re now signed in.")
                    router.push("/")
                } catch (err: unknown) {
                    const axiosErr = err as AxiosError<{ message?: string }>
                    const message = axiosErr.response?.data?.message
                    toast.error(message || "Verification failed")
                }
            }, 250)
        }

        return () => {
            if (autoSubmitTimer.current) {
                window.clearTimeout(autoSubmitTimer.current)
                autoSubmitTimer.current = null
            }
        }
    }, [code, email, verifyOtp, router])

    const handleResend = async () => {
        if (!email) {
            toast.error("Enter your email to resend")
            return
        }
        try {
            await resend.mutateAsync({ email })
            toast.success("If the email exists, a new code has been sent")
        } catch {
            toast.error("Could not resend code")
        }
    }

    const submitting = verifyOtp.isPending
    const resending = resend.isPending

    return (
        <div className="w-full max-w-sm space-y-4 text-center">
            <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight">Verify your email</h1>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code we sent to your email to finish signing in.
                </p>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                disabled={submitting}
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <Label>6-digit code</Label>
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={setCode}
                                containerClassName="justify-center"
                                disabled={submitting}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <Button type="submit" className="w-full" disabled={submitting} aria-busy={submitting}>
                            {submitting ? "Verifying..." : "Verify and sign in"}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <Button variant="ghost" type="button" onClick={handleResend} disabled={resending}>
                            {resending ? "Sending..." : "Resend code"}
                        </Button>
                        <Link className="underline underline-offset-4" href="/signin">
                            Back to sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
