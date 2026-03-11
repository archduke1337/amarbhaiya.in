/**
 * @fileoverview Student course player — course overview with module list.
 */
type Props = { params: Promise<{ id: string }> }

export default async function CoursePlayerPage({ params }: Props) {
  const { id } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Player</h1>
      <p className="text-muted-foreground">Course ID: {id}</p>
      {/* TODO: VideoPlayer, LessonSidebar, ProgressBar */}
    </div>
  )
}
