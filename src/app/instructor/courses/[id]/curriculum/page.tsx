/**
 * @fileoverview Curriculum builder — drag-and-drop modules + lessons.
 */
import { CurriculumBuilder } from "@/components/instructor/CurriculumBuilder"

type Props = { params: Promise<{ id: string }> }

export default async function CurriculumPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Curriculum Builder</h1>
      <p className="text-muted-foreground mb-8 text-lg">Structure your content for course: <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{id}</span></p>
      <CurriculumBuilder />
    </div>
  )
}

