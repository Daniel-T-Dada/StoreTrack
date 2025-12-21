"use client"

import { StaffForm } from "@/components/StaffForm"
import type { StaffFormValues } from "@/components/StaffForm"
import { useCreateStaff } from "@/hooks/useStaff"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMe } from "@/hooks/useMe"

export default function NewStaffPage() {
    const create = useCreateStaff()
    const router = useRouter()
    const { data: me } = useMe()

    const allowedRoles: Array<"staff" | "manager"> =
        me?.role === "admin" ? ["staff", "manager"] : ["staff"]

    if (me?.role && !["admin", "manager"].includes(me.role)) {
        return (
            <div className="space-y-6">
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold tracking-tight">Add Staff</h2>
                    <p className="text-sm text-muted-foreground">Access denied.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">Add Staff</h2>
                <p className="text-sm text-muted-foreground">
                    Create a new staff account and assign a role.
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader className="py-4">
                    <CardTitle className="text-base">Staff Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <StaffForm
                        allowedRoles={allowedRoles}
                        loading={create.isPending}
                        onSubmit={(data: StaffFormValues) =>
                            create.mutate(data, {
                                onSuccess: () => {
                                    toast.success("Staff created")
                                    router.push("/staff")
                                },
                                onError: () => toast.error("Failed to create staff"),
                            })
                        }
                    />
                </CardContent>
            </Card>
        </div>
    )
}
