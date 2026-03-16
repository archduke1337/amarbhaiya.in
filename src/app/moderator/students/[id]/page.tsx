/**
 * @fileoverview Student detail — logs, moderation actions, warnings.
 */
import { StudentDetailPanel } from "@/components/moderator/StudentDetailPanel"
import { ModerationActionMenu } from "@/components/moderator/ModerationActionMenu"

type Props = { params: Promise<{ id: string }> }

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Student Investigation</h1>
          <p className="text-muted-foreground text-lg">Detailed history and metrics for user: <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{id}</span></p>
        </div>
        <ModerationActionMenu userId={id} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-3">
           <StudentDetailPanel userId={id} />
        </div>
        
        {/* Placeholder for action history or deep audit logs */}
        <div className="xl:col-span-3 bg-muted/20 border border-border/50 rounded-xl p-8 text-center text-muted-foreground italic">
          Audit Trail logic will mount here — showing past warnings, mutes, and context logs.
        </div>
      </div>
    </div>
  )
}

