"use client"
import { usePublicStats } from "@/hooks/usePublicStats"

export function StatsSection() {
  const { stats, loading } = usePublicStats()
  const membersCount = stats?.membersCount ?? 0
  const coursesCount = stats?.coursesCount ?? 0
  const averageRating = stats?.averageRating ?? 0
  const successRate = stats?.successRate ?? 0
  const membersCompact = membersCount >= 1000 ? `${Math.floor(membersCount / 1000)}k+` : `${membersCount}+`

  return (
    <section className="py-20 bg-primary/5 transition-opacity duration-500">
      <div className="container px-4 md:px-6 mx-auto">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-primary mb-2">
              {loading ? "..." : membersCompact}
            </span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Engineers Mentored</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-blue-500 mb-2">
              {loading ? "..." : `${successRate}%`}
            </span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Interview Success</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-violet-500 mb-2">
              {loading ? "..." : averageRating}
            </span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Average Rating</span>
          </div>
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-black text-emerald-500 mb-2">
              {loading ? "..." : coursesCount}
            </span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Active Courses</span>
          </div>
        </div>
      </div>
    </section>
  )
}

