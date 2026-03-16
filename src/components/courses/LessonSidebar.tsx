import { useCourse } from "@/hooks/useCourse"
import { useProgress } from "@/hooks/useProgress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayCircle, CheckCircle2, Lock, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function LessonSidebar() {
  const params = useParams()
  const courseId = params.id as string
  const currentLessonId = params.lessonId as string | undefined

  const { course, loading } = useCourse(courseId)
  const { isCompleted, getCourseProgress } = useProgress(courseId)

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-card/30 backdrop-blur-xl border-l border-border/50">
        <div className="p-6 space-y-4 animate-pulse">
           <div className="h-6 w-3/4 bg-muted rounded-lg" />
           <div className="h-4 w-1/2 bg-muted rounded-lg" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 w-full bg-muted/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!course) return null

  const modules = (course as any).modules ?? []
  const totalLessons = modules.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0)
  const stats = getCourseProgress(courseId, totalLessons)

  return (
    <div className="flex flex-col h-full bg-card/20 backdrop-blur-3xl border-l border-border/20">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-border/10 bg-gradient-to-b from-background/50 to-transparent">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-2">
          <BookOpen className="w-3 h-3" />
          Curriculum
        </div>
        <h3 className="font-bold text-lg leading-tight tracking-tight line-clamp-2 mb-4">
          {course.title}
        </h3>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Progress</span>
            <span>{stats.percent}%</span>
          </div>
          <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.percent}%` }}
              transition={{ duration: 1, ease: "circOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full" defaultValue={modules.map((m: any) => m.$id)}>
          <AnimatePresence>
            {modules.map((mod: any, i: number) => (
              <AccordionItem value={mod.$id} key={mod.$id} className="border-b border-border/10 last:border-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-white/5 transition-all text-sm font-bold tracking-tight">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-muted/50 flex items-center justify-center text-[10px] text-muted-foreground mr-1">
                      {i + 1}
                    </span>
                    <span className="text-left line-clamp-1">{mod.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2 pt-0">
                  <div className="flex flex-col px-2">
                    {mod.lessons?.map((lesson: any) => {
                      const isCurrent = lesson.$id === currentLessonId
                      const completed = isCompleted(courseId, lesson.$id)
                      const isLocked = !lesson.isFree && !lesson.isPublished // Placeholder for entry check
                      
                      return (
                        <motion.div
                          key={lesson.$id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            href={`/app/courses/${courseId}/${lesson.$id}`}
                            className={cn(
                              "group flex items-center gap-3 px-4 py-3 text-sm transition-all rounded-xl m-1 relative overflow-hidden",
                              isCurrent
                                ? "bg-primary/10 text-primary font-bold shadow-sm"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                              isLocked && "pointer-events-none opacity-40"
                            )}
                          >
                            {/* Active Indicator Bar */}
                            {isCurrent && (
                              <motion.div 
                                layoutId="active-indicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full my-3"
                              />
                            )}

                            <div className="relative shrink-0 flex items-center justify-center">
                              {completed ? (
                                <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                              ) : isLocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <PlayCircle className={cn(
                                  "w-5 h-5 transition-transform group-hover:scale-110",
                                  isCurrent ? "text-primary" : "text-muted-foreground/50"
                                )} />
                              )}
                            </div>
                            
                            <span className="flex-1 line-clamp-2 tracking-tight">{lesson.title}</span>
                            
                            {isCurrent && (
                              <ChevronRight className="w-4 h-4 animate-pulse opacity-50" />
                            )}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </AnimatePresence>
        </Accordion>
      </ScrollArea>
    </div>
  )
}
