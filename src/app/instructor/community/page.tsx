/**
 * @fileoverview Instructor community — reply to comments and forums.
 */
export default function InstructorCommunityPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      <p className="text-muted-foreground mb-8">Reply to student comments and forum threads.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Recent Comments</h2>
          <p className="mt-2 text-sm text-muted-foreground">Use course discussion views to respond quickly.</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Forum Threads</h2>
          <p className="mt-2 text-sm text-muted-foreground">Open the thread list from course community pages for full context.</p>
        </div>
      </div>
    </div>
  )
}
