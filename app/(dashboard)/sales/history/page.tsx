"use client"

import Link from "next/link"

import { useMe } from "@/hooks/useMe"
import { useStaff } from "@/hooks/useStaff"
import { useTransactions } from "@/hooks/useTransactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { formatNaira } from "@/lib/utils"

export default function SalesHistoryPage() {
  const { data: me } = useMe()
  const canFilterByStaff = !!me && ["admin", "manager"].includes(me.role)

  const [staffId, setStaffId] = useState<string>("")

  const staffQuery = useStaff({ enabled: canFilterByStaff })
  const txQuery = useTransactions(
    {
      staff: canFilterByStaff && staffId ? staffId : undefined,
      page: 1,
      limit: 50,
    },
    { enabled: !!me }
  )

  const data = txQuery.data?.data ?? []
  const isLoading = txQuery.isLoading
  const isEmpty = !isLoading && data.length === 0

  const totalAmount = data.reduce((sum, t) => sum + (Number(t.total) || 0), 0)
  const totalItems = data.reduce((sum, t) => sum + (Number(t.totalQuantity) || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">Sales History</h2>
          <p className="text-sm text-muted-foreground">
            Review recorded sales and transaction totals.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/sales">New Sale</Link>
        </Button>
      </div>

      {canFilterByStaff ? (
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-w-sm space-y-2">
              <Label htmlFor="sales-staff">Staff</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger id="sales-staff" className="w-full">
                  <SelectValue placeholder="All staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All staff</SelectItem>
                  {(staffQuery.data ?? []).map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isEmpty ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No sales recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {tx.lastCreatedAt
                          ? new Date(tx.lastCreatedAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.staffName ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link className="underline underline-offset-4" href={`/sales/history/${tx.id}`}>
                          {tx.itemsCount}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">{tx.totalQuantity}</TableCell>
                      <TableCell className="text-right">{formatNaira(tx.total)}</TableCell>
                    </TableRow>
                  ))
                )}

                {!isEmpty ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Totals
                    </TableCell>
                    <TableCell className="text-right font-medium">{totalItems}</TableCell>
                    <TableCell className="text-right font-medium">{formatNaira(totalAmount)}</TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}