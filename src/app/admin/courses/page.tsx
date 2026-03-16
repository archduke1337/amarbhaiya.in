/**
 * @fileoverview Admin courses list — full CRUD.
 */
import Link from "next/link"
import { Query } from "node-appwrite"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ROLES } from "@/config/roles"
import { coursesDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function AdminCoursesPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const result = await coursesDb.list({ queries: [Query.orderDesc("$createdAt")], limit: 100 })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Courses</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.documents.map((doc: any) => (
            <TableRow key={doc.$id}>
              <TableCell>
                <Link href={`/admin/courses/${doc.$id}`} className="font-semibold hover:underline">
                  {doc.title || "Untitled Course"}
                </Link>
                <p className="text-xs text-muted-foreground">{doc.$id}</p>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{doc.instructorId || "-"}</TableCell>
              <TableCell>
                {Number(doc.price || 0).toLocaleString(undefined, { style: "currency", currency: "INR" })}
              </TableCell>
              <TableCell>
                <Badge variant={doc.status === "published" ? "secondary" : "outline"} className="capitalize">
                  {doc.status || "draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(doc.$createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
