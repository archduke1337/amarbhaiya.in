/**
 * @fileoverview Instructor student enrollments page (no revenue shown).
 */
import { StudentTable } from "@/components/instructor/StudentTable"

type Props = { params: Promise<{ id: string }> }

export default async function StudentsPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Enrolled Students</h1>
      <p className="text-muted-foreground mb-8 text-lg">Manage your learners for course: <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{id}</span></p>
      <StudentTable courseId={id} />
    </div>
  )
}

