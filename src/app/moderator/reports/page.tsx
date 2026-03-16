/**
 * @fileoverview Flagged content queue — review and take action.
 */
import { FlaggedContentList } from "@/components/moderator/FlaggedContentList"

export default function ReportsPage() {
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Flagged Content</h1>
      <p className="text-muted-foreground mb-8 text-lg">Review and manage reported material from the community.</p>
      <FlaggedContentList />
    </div>
  )
}

