import { ForumCategoryList } from "@/components/community/ForumCategoryList"

export default function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-3">Community Forums</h1>
        <p className="text-xl text-muted-foreground">Collaborate, share knowledge, and grow with 4,000+ fellow students.</p>
      </div>
      
      <ForumCategoryList />
    </div>
  )
}
