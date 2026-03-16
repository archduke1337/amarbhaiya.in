/**
 * @fileoverview Admin course detail — full edit, stats, enrollments.
 */
import { Query } from "node-appwrite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ROLES } from "@/config/roles"
import { coursesDb, enrollmentsDb, paymentsDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

type Props = { params: Promise<{ id: string }> }

export default async function AdminCourseDetailPage({ params }: Props) {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const { id } = await params
  const [course, enrollments, payments] = await Promise.all([
    coursesDb.get(id, true),
    enrollmentsDb.list({ queries: [Query.equal("courseId", id)], limit: 1 }),
    paymentsDb.list({ queries: [Query.equal("courseId", id)], limit: 100 }),
  ])

  const revenue = payments.documents
    .filter((p: any) => p.status === "completed")
    .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Course Detail</h1>
      <p className="text-muted-foreground">Course ID: {id}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">Enrollments</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{enrollments.total}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Payments</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">{payments.total}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Revenue</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">
            {(revenue / 100).toLocaleString(undefined, { style: "currency", currency: "INR" })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-130 overflow-auto rounded-md border bg-muted/30 p-4 text-xs">
            {JSON.stringify(course, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
