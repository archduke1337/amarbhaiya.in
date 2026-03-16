/**
 * @fileoverview PaymentTable - admin payment records table.
 */

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type PaymentRow = {
  id: string
  userId: string
  courseId: string
  amount: number
  currency: string
  method?: string
  status?: string
  createdAt: string
}

type PaymentTableProps = {
  payments: PaymentRow[]
}

function statusVariant(status?: string): "secondary" | "outline" | "destructive" {
  if (status === "completed") return "secondary"
  if (status === "failed") return "destructive"
  return "outline"
}

export function PaymentTable({ payments }: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No payment records found.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Payment</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              <Link className="font-semibold hover:underline" href={`/admin/payments/${payment.id}`}>
                {payment.id.slice(0, 10)}...
              </Link>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{payment.userId}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{payment.courseId}</TableCell>
            <TableCell>
              {(payment.amount / 100).toLocaleString(undefined, {
                style: "currency",
                currency: payment.currency || "INR",
                maximumFractionDigits: 2,
              })}
            </TableCell>
            <TableCell className="capitalize">{payment.method || "-"}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(payment.status)} className="capitalize">
                {payment.status || "pending"}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(payment.createdAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
