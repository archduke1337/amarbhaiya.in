/**
 * @fileoverview Curriculum builder — drag-and-drop modules + lessons.
 */
type Props = { params: Promise<{ id: string }> }

export default async function CurriculumPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Curriculum Builder</h1>
      <p className="text-muted-foreground mb-4">Course ID: {id}</p>
      {/* TODO: CurriculumBuilder component */}
    </div>
  )
}
