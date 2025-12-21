import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { MeResponse } from "@/types/api"

export type CloudinarySignatureResponse = {
    cloudName: string
    apiKey: string
    timestamp: number
    signature: string
    folder: string
    publicId: string
}

export type UploadProfileImageArgs = {
    file: File
    onProgress?: (pct: number) => void
    maxBytes?: number
}

const DEFAULT_MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024

const uploadToCloudinaryWithProgress = (
    url: string,
    formData: FormData,
    onProgress?: (pct: number) => void
) => {
    return new Promise<{ public_id: string; secure_url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", url)

        xhr.upload.onprogress = (e) => {
            if (!onProgress) return
            if (!e.lengthComputable) return
            const pct = Math.round((e.loaded / e.total) * 100)
            onProgress(pct)
        }

        xhr.onload = () => {
            try {
                const json = JSON.parse(xhr.responseText || "{}")
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(json)
                    return
                }

                const msg = json?.error?.message || `Cloudinary upload failed (${xhr.status})`
                reject(new Error(msg))
            } catch {
                reject(new Error("Cloudinary upload failed"))
            }
        }

        xhr.onerror = () => reject(new Error("Network error while uploading"))
        xhr.send(formData)
    })
}

export const useUploadProfileImage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ file, onProgress, maxBytes }: UploadProfileImageArgs) => {
            if (!file || !file.type?.startsWith("image/")) {
                throw new Error("Please select an image file")
            }

            const effectiveMax = typeof maxBytes === "number" ? maxBytes : DEFAULT_MAX_PROFILE_IMAGE_BYTES
            if (effectiveMax > 0 && file.size > effectiveMax) {
                const mb = (effectiveMax / (1024 * 1024)).toFixed(0)
                throw new Error(`Image must be ${mb}MB or less`)
            }

            // 1) signature from our API (proxied)
            const sig = (await api.post<CloudinarySignatureResponse>("/uploads/cloudinary-signature")).data

            // 2) direct upload to Cloudinary
            const fd = new FormData()
            fd.append("file", file)
            fd.append("api_key", sig.apiKey)
            fd.append("timestamp", String(sig.timestamp))
            fd.append("signature", sig.signature)
            fd.append("folder", sig.folder)
            fd.append("public_id", sig.publicId)

            const cloudUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`
            const uploaded = await uploadToCloudinaryWithProgress(cloudUrl, fd, onProgress)

            // 3) persist public_id to our profile
            return (
                await api.put<MeResponse>("/auth/me/profile-image", {
                    profileImagePublicId: uploaded.public_id,
                })
            ).data
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(["me"], updated)
        },
    })
}

export const useRemoveProfileImage = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => (await api.delete<MeResponse>("/auth/me/profile-image")).data,
        onSuccess: (updated) => {
            queryClient.setQueryData(["me"], updated)
        },
    })
}
