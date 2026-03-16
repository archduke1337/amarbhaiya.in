/**
 * @fileoverview Instructor course settings — title, thumbnail, pricing, publish toggle.
 */
type Props = { params: Promise<{ id: string }> }

export default async function CourseSettingsPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold mb-6">Course Settings</h1>
      <p className="text-muted-foreground mb-4">Course ID: {id}</p>
      <form className="grid max-w-2xl gap-4 rounded-lg border p-5">
        <input className="h-10 rounded-md border bg-background px-3" placeholder="Course title" />
        <input className="h-10 rounded-md border bg-background px-3" placeholder="Price" type="number" />
        <textarea className="min-h-28 rounded-md border bg-background p-3" placeholder="Short description" />
        <button type="button" className="h-10 rounded-md bg-primary px-4 text-primary-foreground w-fit">Save Settings</button>
      </form>
    </div>
  )
}
