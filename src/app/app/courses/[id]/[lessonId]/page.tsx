/**
 * @fileoverview Lesson player — video + content for a specific lesson.
 */
type Props = { params: Promise<{ id: string; lessonId: string }> }

export default async function LessonPlayerPage({ params }: Props) {
  const { id, lessonId } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Lesson</h1>
      <p className="text-muted-foreground">Course: {id} | Lesson: {lessonId}</p>
      {/* TODO: VideoPlayer, LessonContent, CommentSection, CompletionButton */}
    </div>
  )
}
