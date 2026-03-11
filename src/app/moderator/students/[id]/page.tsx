/**
 * @fileoverview Student detail — logs, moderation actions, warnings.
 */
type Props = { params: Promise<{ id: string }> }

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Detail</h1>
      <p className="text-muted-foreground mb-4">User ID: {id}</p>
      {/* TODO: StudentDetailPanel, ActionHistoryTable, ModerationActionMenu */}
    </div>
  )
}
