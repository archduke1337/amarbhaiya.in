/**
 * @fileoverview CategoryPage — displays all threads in a specific forum category.
 */
import { ThreadList } from "@/components/community/ThreadList"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

type Props = { params: Promise<{ categoryId: string }> }

export default async function CategoryPage({ params }: Props) {
  const { categoryId } = await params

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link 
        href="/app/community" 
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Categories
      </Link>
      
      <ThreadList categoryId={categoryId} />
    </div>
  )
}
