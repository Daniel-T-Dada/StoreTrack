"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMe } from "@/hooks/useMe"
import { useLowStock, useProfit, useSalesByStaff, useTotalSales } from "@/hooks/useReports"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"


const formatMoney = (value: unknown) => {
  const num = typeof value === "number" ? value : Number(value)
  return Number.isFinite(num) ? num.toFixed(2) : "0.00"
}

const Home = () => {
  const router = useRouter()
  const { data: me, isLoading: meLoading, isError: meError } = useMe()

  // Redirect if not logged in
  useEffect(() => {
    if (!meLoading && meError) {
      toast.error("You must be logged in to access the dashboard")
      router.push("/signin")
    }
  }, [meLoading, meError, router])

  if (me && !["admin", "manager"].includes(me.role)) {
    router.replace("/staff-dashboard")
    return <StaffDashboard />
  }

  return <OwnerDashboard meLoading={meLoading} />
}

export default Home

function StaffDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          You’re logged in as staff. Reports are available to admins/managers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next step</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Go to Sales to record sales for customers.
        </CardContent>
      </Card>
    </div>
  )
}

function OwnerDashboard({ meLoading }: { meLoading: boolean }) {
  // Fetch reports (admin/manager only)
  const { data: totalSalesData, isLoading: totalSalesLoading, error: totalSalesError } = useTotalSales()
  const { data: salesByStaffData, isLoading: salesByStaffLoading, error: salesByStaffError } = useSalesByStaff()
  const { data: lowStockData, isLoading: lowStockLoading, error: lowStockError } = useLowStock()
  const { data: profitData, isLoading: profitLoading, error: profitError } = useProfit()

  // Error notifications
  useEffect(() => {
    if (totalSalesError) toast.error("Failed to fetch total sales")
    if (salesByStaffError) toast.error("Failed to fetch sales by staff")
    if (lowStockError) toast.error("Failed to fetch low stock report")
    if (profitError) toast.error("Failed to fetch profit report")
  }, [totalSalesError, salesByStaffError, lowStockError, profitError])

  const isLoading =
    meLoading || totalSalesLoading || salesByStaffLoading || lowStockLoading || profitLoading

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-24" /> : <>${formatMoney(totalSalesData?.totalSales)}</>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-24" /> : <>${formatMoney(totalSalesData?.totalRevenue)}</>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Transactions</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-16" /> : <>{totalSalesData?.totalTransactions ?? 0}</>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Profit</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-24" /> : <>${formatMoney(profitData?.profit)}</>}
          </CardContent>
        </Card>
      </div>

      {/* Sales by Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Staff</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Name</TableHead>
                  <TableHead className="text-right">Total Sales Amount</TableHead>
                  <TableHead className="text-right">Total Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesByStaffData?.length ? (
                  salesByStaffData.map((staff, idx) => (
                    <TableRow key={`${staff.staffId ?? staff.staffName ?? "staff"}-${idx}`}>
                      <TableCell>{staff.staffName}</TableCell>
                      <TableCell className="text-right">${formatMoney(staff.totalSales)}</TableCell>
                      <TableCell className="text-right">{staff.totalQuantity ?? 0}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No staff sales data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Low Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Low Stock Threshold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockData?.length ? (
                  lowStockData.map((product, idx) => (
                    <TableRow key={`${product._id ?? product.name ?? "product"}-${idx}`}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">{product.lowStockThreshold}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No low stock products.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByStaffData ?? []} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="staffName" tickLine={false} axisLine={false} interval={0} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    const n = Number(v)
                    if (!Number.isFinite(n)) return "0"
                    return n.toLocaleString()
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = Number(value)
                    if (!Number.isFinite(n)) return value
                    return n.toLocaleString()
                  }}
                />
                <Bar dataKey="totalSales" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
