/**
 * @fileoverview Instructor panel loading skeleton.
 */
export default function InstructorLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading instructor panel…</p>
      </div>
    </div>
  )
}
