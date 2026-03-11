/**
 * @fileoverview Instructor course overview — stats, quick actions.
 */
type Props = { params: Promise<{ id: string }> }

export default async function InstructorCourseOverviewPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Overview</h1>
      <p className="text-muted-foreground">Course ID: {id}</p>
      {/* TODO: CourseStats, QuickActions */}
    </div>
  )
}
