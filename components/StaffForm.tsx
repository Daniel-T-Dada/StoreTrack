"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from "@/components/ui/select"

export type StaffFormValues = {
    name: string
    email: string
    password: string
    role: string
}

type StaffFormProps = {
    defaultValues?: Partial<StaffFormValues>
    allowedRoles?: Array<"staff" | "manager">
    loading?: boolean
    onSubmit: (data: StaffFormValues) => void | Promise<void>
}

export function StaffForm({
    defaultValues,
    allowedRoles = ["staff"],
    loading,
    onSubmit,
}: StaffFormProps) {
    const { register, handleSubmit, setValue } = useForm<StaffFormValues>({
        defaultValues: {
            name: defaultValues?.name ?? "",
            email: defaultValues?.email ?? "",
            password: "",
            role: defaultValues?.role ?? allowedRoles[0] ?? "",
        },
    })

    const disabled = !!loading

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <Label htmlFor="staff-name">Full Name</Label>
                    <Input
                        id="staff-name"
                        placeholder="Jane Doe"
                        autoComplete="name"
                        disabled={disabled}
                        {...register("name")}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                        id="staff-email"
                        type="email"
                        inputMode="email"
                        placeholder="jane@example.com"
                        autoComplete="email"
                        disabled={disabled}
                        {...register("email")}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                        id="staff-password"
                        type="password"
                        placeholder="Create a password"
                        autoComplete="new-password"
                        disabled={disabled}
                        {...register("password")}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Label htmlFor="staff-role">Role</Label>
                    <input type="hidden" {...register("role")} />
                    <Select
                        defaultValue={defaultValues?.role ?? allowedRoles[0]}
                        onValueChange={(value) =>
                            setValue("role", value, { shouldDirty: true })
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger id="staff-role">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            {allowedRoles.includes("staff") ? (
                                <SelectItem value="staff">Staff</SelectItem>
                            ) : null}
                            {allowedRoles.includes("manager") ? (
                                <SelectItem value="manager">Manager</SelectItem>
                            ) : null}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-end">
                <Button type="submit" disabled={disabled} aria-busy={disabled}>
                    {disabled ? "Saving..." : "Save Staff"}
                </Button>
            </div>
        </form>
    )
}
