/**
 * @fileoverview Instructor courses list — manage own courses.
 */
import Link from "next/link"
import { Query } from "node-appwrite"
import { coursesDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function InstructorCoursesPage() {
  const user = await getLoggedInUser()
  if (!user) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  const courses = await coursesDb.list({ queries: [Query.equal("instructorId", user.$id), Query.orderDesc("$createdAt")], limit: 100 })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <Link href="/instructor/courses/new" className="inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
        Create Course
      </Link>
      <div className="grid gap-3">
        {courses.documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No courses yet.</p>
        ) : (
          courses.documents.map((course: any) => (
            <Link key={course.$id} href={`/instructor/courses/${course.$id}`} className="rounded-md border p-4 hover:bg-muted/40">
              <p className="font-semibold">{course.title || "Untitled course"}</p>
              <p className="text-xs text-muted-foreground">{course.status || "draft"}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
