/**
 * @fileoverview Payment detail — transaction info, refund actions.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES } from "@/config/roles"
import { paymentsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

type Props = { params: Promise<{ id: string }> }

export default async function AdminPaymentDetailPage({ params }: Props) {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const { id } = await params
  const payment = await paymentsDb.get(id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Payment Detail</h1>
      <p className="text-muted-foreground">Payment ID: {id}</p>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-130 overflow-auto rounded-md border bg-muted/30 p-4 text-xs">
            {JSON.stringify(payment, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
