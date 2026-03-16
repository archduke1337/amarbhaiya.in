/**
 * @fileoverview Course Player Layout — wraps the video/lesson content and the sidebar.
 */
import { ReactNode } from "react"
import { LessonSidebar } from "@/components/courses/LessonSidebar"

type Props = {
  children: ReactNode
  params: Promise<{ id: string }>
}

export default async function CoursePlayerLayout({ children }: Props) {
  // `params` can be accessed in Client Components using `useParams()` if needed
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Main Content Area (Video, Comments, Resources) */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Curriculum Sidebar */}
      <aside className="w-[350px] shrink-0 border-l border-border/50 hidden lg:block bg-card/50 backdrop-blur">
        <LessonSidebar />
      </aside>
    </div>
  )
}
