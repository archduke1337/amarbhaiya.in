/**
 * @fileoverview Admin course detail — full edit, stats, enrollments.
 */
type Props = { params: Promise<{ id: string }> }

export default async function AdminCourseDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Detail</h1>
      <p className="text-muted-foreground mb-4">Course ID: {id}</p>
      {/* TODO: FullCourseEditor, EnrollmentStats */}
    </div>
  )
}
