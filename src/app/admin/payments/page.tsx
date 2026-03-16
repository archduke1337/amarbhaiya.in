/**
 * @fileoverview All transactions + refunds.
 */
import { Query } from "node-appwrite"
import { PaymentTable } from "@/components/admin/PaymentTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES } from "@/config/roles"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { paymentsDb } from "@/lib/appwrite/database"

export default async function AdminPaymentsPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const result = await paymentsDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 100 })
  const payments = result.documents.map((doc: any) => ({
    id: doc.$id,
    userId: doc.userId || "",
    courseId: doc.courseId || "",
    amount: Number(doc.amount || 0),
    currency: doc.currency || "INR",
    method: doc.method || "",
    status: doc.status || "pending",
    createdAt: doc.$createdAt,
  }))

  const total = payments.reduce((sum, item) => sum + item.amount, 0)
  const completed = payments.filter((item) => item.status === "completed").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payments</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transactions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{payments.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{completed}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Gross Volume</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {(total / 100).toLocaleString(undefined, { style: "currency", currency: "INR" })}
          </CardContent>
        </Card>
      </div>

      <PaymentTable payments={payments} />
    </div>
  )
}
