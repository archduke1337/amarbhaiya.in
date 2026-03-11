/**
 * @fileoverview Instructor student enrollments page (no revenue shown).
 */
type Props = { params: Promise<{ id: string }> }

export default async function StudentsPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Enrolled Students</h1>
      <p className="text-muted-foreground mb-4">Course ID: {id}</p>
      {/* TODO: StudentTable component */}
    </div>
  )
}
