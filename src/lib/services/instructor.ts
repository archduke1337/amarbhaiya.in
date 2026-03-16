/**
 * @fileoverview Instructor authorization helpers — course ownership verification.
 */
import { coursesDb } from "@/lib/appwrite/database"
import { ROLES } from "@/config/roles"
import type { Models } from "node-appwrite"

/**
 * Verify that the given user owns the course. Admins bypass the check.
 * Returns { authorized: true, course } or { authorized: false, error, status }.
 */
export async function verifyCourseOwnership(
  user: Models.User<Models.Preferences>,
  courseId: string
): Promise<
  | { authorized: true; course: Record<string, unknown> }
  | { authorized: false; error: string; status: number }
> {
  try {
    const course = await coursesDb.get(courseId, true)

    if (!course) {
      return { authorized: false, error: "Course not found", status: 404 }
    }

    // Admins can modify any course
    if (user.labels.includes(ROLES.ADMIN)) {
      return { authorized: true, course }
    }

    if (course.instructorId !== user.$id) {
      return { authorized: false, error: "You do not own this course", status: 403 }
    }

    return { authorized: true, course }
  } catch {
    return { authorized: false, error: "Failed to verify course ownership", status: 500 }
  }
}
