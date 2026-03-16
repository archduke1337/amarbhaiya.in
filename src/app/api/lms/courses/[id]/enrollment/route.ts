/**
 * @fileoverview GET /api/lms/courses/[id]/enrollment — check enrollment status.
 * POST /api/lms/courses/[id]/enrollment — enroll in a free course.
 */

import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite"
import { getLoggedInUser } from "@/lib/appwrite/server"
import { enrollmentsDb, coursesDb } from "@/lib/appwrite/database"
import { createEnrollment } from "@/lib/services/enrollment"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ enrolled: false })
    }

    const { id: courseId } = await params
    const enrollment = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)

    return NextResponse.json({
      enrolled: !!enrollment,
      enrollment: enrollment ?? null,
    })
  } catch (error) {
    console.error("[API] GET /api/lms/courses/[id]/enrollment", error)
    return NextResponse.json({ error: "Failed to check enrollment" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getLoggedInUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: courseId } = await params

    // CRITICAL: Verify course is actually free
    const course = await coursesDb.get(courseId)
    if (!course || (!course.isFree && (course.price || 0) > 0)) {
      return NextResponse.json({ error: "This course is not free. Payment required." }, { status: 403 })
    }

    // Check if already enrolled
    const existing = await enrollmentsDb.getByUserAndCourse(user.$id, courseId)
    if (existing) {
      return NextResponse.json({ enrollment: existing, message: "Already enrolled" })
    }

    const { enrollment, message } = await createEnrollment({
      userId: user.$id,
      courseId,
    })

    return NextResponse.json({ enrollment, message }, { status: 201 })
  } catch (error) {
    console.error("[API] POST /api/lms/courses/[id]/enrollment", error)
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 })
  }
}
