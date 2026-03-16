/**
 * @fileoverview Schedule a new live session.
 */
export default function NewLiveSessionPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold mb-6">Schedule Live Session</h1>
      <form className="grid max-w-2xl gap-4 rounded-lg border p-5">
        <input className="h-10 rounded-md border bg-background px-3" placeholder="Session title" />
        <input className="h-10 rounded-md border bg-background px-3" placeholder="Date and time" type="datetime-local" />
        <textarea className="min-h-24 rounded-md border bg-background p-3" placeholder="Session agenda" />
        <button type="button" className="h-10 rounded-md bg-primary px-4 text-primary-foreground w-fit">Schedule Session</button>
      </form>
    </div>
  )
}
