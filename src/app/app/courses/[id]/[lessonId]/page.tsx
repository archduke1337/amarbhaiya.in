/**
 * @fileoverview Lesson player — main viewer for video and text content.
 */
"use client"

import { useCourse } from "@/hooks/useCourse"
import { useProgress } from "@/hooks/useProgress"
import { useParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/courses/VideoPlayer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronLeft, ChevronRight, FileText, Download, MessageSquare } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LessonComments } from "@/components/courses/LessonComments"
import { useMemo } from "react"
import { sanitizeHtml } from "@/lib/sanitize"

export default function LessonPlayerPage() {
  const { id: courseId, lessonId } = useParams() as { id: string; lessonId: string }
  const router = useRouter()
  const { course, loading } = useCourse(courseId)
  const { markComplete, isCompleted } = useProgress(courseId)

  // Derive lesson data unconditionally so hooks are always called in the same order
  const modules = (course as any)?.modules ?? []
  const allLessons = modules.flatMap((m: any) => m.lessons ?? [])
  const currentIndex = allLessons.findIndex((l: any) => l.$id === lessonId)
  const currentLesson: any = allLessons[currentIndex] ?? null
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const completed = isCompleted(courseId, lessonId)

  // useMemo must be called unconditionally — before any early returns
  const safeContent = useMemo(
    () => (currentLesson?.content ? sanitizeHtml(currentLesson.content) : ""),
    [currentLesson?.content]
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!course) return <div className="p-8 text-center">Course not found</div>

  if (!currentLesson) {
    return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>
  }

  const handleCompleteAndNext = () => {
    markComplete(courseId, lessonId)
    if (nextLesson) {
      router.push(`/app/courses/${courseId}/${nextLesson.$id}`)
    }
  }

  const videoUrl = currentLesson.videoFileId
    ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_COURSE_VIDEOS}/files/${currentLesson.videoFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    : ""

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">
      {/* Immersive Video Section */}
      {videoUrl && (
        <div className="bg-black/95 w-full relative border-b border-white/5">
          <div className="max-w-6xl mx-auto py-2">
            <VideoPlayer 
              url={videoUrl} 
              title={currentLesson.title} 
              onEnded={() => {
                if (!completed) markComplete(courseId, lessonId)
              }}
            />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 bg-background/50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Area */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/50 pb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-foreground">{currentLesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Curriculum</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">{currentLesson.summary || "Core concept mastery"}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {completed ? (
                <Button variant="secondary" className="gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-default">
                  <CheckCircle2 className="w-5 h-5" /> Completed
                </Button>
              ) : (
                <Button onClick={handleCompleteAndNext} className="gap-2 shadow-2xl shadow-primary/40 font-bold px-6">
                  <CheckCircle2 className="w-5 h-5" /> Mark Complete & Next
                </Button>
              )}
            </div>
          </div>

          {/* Tabbed Content Section */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted/40 p-1 mb-8 border border-border/50 inline-flex">
              <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background">
                <FileText className="w-4 h-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-background">
                <Download className="w-4 h-4" /> Resources
              </TabsTrigger>
              <TabsTrigger value="discussions" className="gap-2 data-[state=active]:bg-background">
                <MessageSquare className="w-4 h-4" /> Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
               <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-lg">
                {safeContent ? (
                  <div dangerouslySetInnerHTML={{ __html: safeContent }} />
                ) : (
                  <div className="py-12 text-center border-2 border-dashed rounded-3xl opacity-40">
                    <p className="italic">No supplementary reading material provided for this lesson.</p>
                  </div>
                )}
               </div>
            </TabsContent>

            <TabsContent value="resources">
              {currentLesson.resources && currentLesson.resources.length > 0 ? (
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentLesson.resources.map((res: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl border border-border/50 bg-card/30 flex items-center justify-between group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{res.title || "Resource"}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{res.type || "Document"} • {res.size || ""}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => window.open(res.url, "_blank")}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                 </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed rounded-3xl opacity-40">
                  <p className="italic">No resources attached to this lesson.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussions">
               <LessonComments lessonId={lessonId} />
            </TabsContent>
          </Tabs>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between border-t border-border/50 pt-12 mt-12 mb-8">
            {prevLesson ? (
              <Button variant="outline" className="rounded-full px-6" onClick={() => router.push(`/app/courses/${courseId}/${prevLesson.$id}`)}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
            ) : <div />}
            
            {nextLesson ? (
              <Button variant="outline" className="rounded-full px-6" onClick={() => router.push(`/app/courses/${courseId}/${nextLesson.$id}`)}>
                Next Lesson <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              completed && (
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/40 shadow-2xl rounded-full px-8 font-black">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> FINISH COURSE
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
