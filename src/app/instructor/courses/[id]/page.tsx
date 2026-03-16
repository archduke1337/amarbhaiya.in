/**
 * @fileoverview Instructor course overview — stats, quick actions.
 */
import Link from "next/link"
import { Query } from "node-appwrite"
import { coursesDb, enrollmentsDb } from "@/lib/appwrite/database"

type Props = { params: Promise<{ id: string }> }

export default async function InstructorCourseOverviewPage({ params }: Props) {
  const { id } = await params
  const [course, enrollments] = await Promise.all([
    coursesDb.get(id, true),
    enrollmentsDb.list({ queries: [Query.equal("courseId", id)], limit: 1 }),
  ])

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold mb-6">Course Overview</h1>
      <p className="text-muted-foreground">Course ID: {id}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Title</p>
          <p className="text-lg font-semibold">{(course as any).title || "Untitled"}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Enrollments</p>
          <p className="text-lg font-semibold">{enrollments.total}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href={`/instructor/courses/${id}/curriculum`} className="rounded-md border px-3 py-2 text-sm">Edit Curriculum</Link>
        <Link href={`/instructor/courses/${id}/settings`} className="rounded-md border px-3 py-2 text-sm">Course Settings</Link>
        <Link href={`/instructor/courses/${id}/students`} className="rounded-md border px-3 py-2 text-sm">View Students</Link>
      </div>
    </div>
  )
}
