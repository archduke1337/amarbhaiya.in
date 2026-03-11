/**
 * @fileoverview Instructor course settings — title, thumbnail, pricing, publish toggle.
 */
type Props = { params: Promise<{ id: string }> }

export default async function CourseSettingsPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Settings</h1>
      <p className="text-muted-foreground mb-4">Course ID: {id}</p>
      {/* TODO: CourseSettingsForm */}
    </div>
  )
}
