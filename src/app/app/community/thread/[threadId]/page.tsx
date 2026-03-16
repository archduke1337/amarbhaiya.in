/**
 * @fileoverview ThreadPage — displays a specific thread and its full conversation.
 */
import { ThreadView } from "@/components/community/ThreadView"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

type Props = { params: Promise<{ threadId: string }> }

export default async function ThreadPage({ params }: Props) {
  const { threadId } = await params

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link 
        href=".." // Simple back to category
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Discussion
      </Link>
      
      <ThreadView threadId={threadId} />
    </div>
  )
}
