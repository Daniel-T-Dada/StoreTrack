"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useMe } from "@/hooks/useMe"
import { useRemoveProfileImage, useUploadProfileImage } from "@/hooks/useProfileImage"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024

export default function ProfilePage() {
    const router = useRouter()
    const { data: me, isLoading, isError } = useMe()

    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number | null>(null)

    const uploadMutation = useUploadProfileImage()
    const removeMutation = useRemoveProfileImage()

    const isBusy = uploadMutation.isPending || removeMutation.isPending

    const initials = useMemo(() => {
        const raw = (me?.name ?? "").trim()
        if (!raw) return "?"
        const parts = raw.split(/\s+/).filter(Boolean)
        const first = parts[0]?.[0] ?? "?"
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
        return (first + last).toUpperCase()
    }, [me?.name])

    if (!isLoading && isError) {
        router.replace("/signin")
        return null
    }

    const pickFile = () => fileInputRef.current?.click()

    const onFileSelected = (file: File | null) => {
        if (!file) return

        setUploadProgress(0)
        uploadMutation.mutate(
            {
                file,
                maxBytes: MAX_PROFILE_IMAGE_BYTES,
                onProgress: (pct) => setUploadProgress(pct),
            },
            {
                onSuccess: () => {
                    toast.success("Profile picture updated")
                },
                onError: (err) => {
                    const message = err instanceof Error ? err.message : "Failed to upload profile picture"
                    toast.error(message)
                },
                onSettled: () => {
                    setUploadProgress(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                },
            }
        )
    }

    const remove = () => {
        removeMutation.mutate(undefined, {
            onSuccess: () => toast.success("Profile picture removed"),
            onError: (err) => {
                const message = err instanceof Error ? err.message : "Failed to remove profile picture"
                toast.error(message)
            },
        })
    }

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your account details and profile picture.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
                    />

                    <div className="flex items-center gap-4">
                        <Avatar className="size-14">
                            <AvatarImage src={me?.profileImage ?? undefined} alt={me?.name ?? "Profile"} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <div className="font-medium truncate">{me?.name ?? (isLoading ? "Loading…" : "")}</div>
                            <div className="text-sm text-muted-foreground truncate">Role: {me?.role ?? "—"}</div>
                            {me?.email ? <div className="text-sm text-muted-foreground truncate">{me.email}</div> : null}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button onClick={pickFile} disabled={isBusy}>
                            {uploadMutation.isPending ? "Uploading…" : "Change picture"}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={remove}
                            disabled={isBusy || !me?.profileImage}
                        >
                            Remove picture
                        </Button>

                        {isBusy && typeof uploadProgress === "number" ? (
                            <div className="text-xs text-muted-foreground tabular-nums sm:ml-auto">
                                Uploading: {uploadProgress}%
                            </div>
                        ) : null}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Only image files are allowed. Max size: 5MB.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
