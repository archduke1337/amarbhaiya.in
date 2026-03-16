/**
 * @fileoverview CurriculumBuilder - Professional curriculum management for instructors.
 */
"use client"

import { useState } from "react"
import { Plus, GripVertical, Trash2, Edit2, Video, FileText, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { VideoUploader } from "./VideoUploader"
import { useCurriculum } from "@/hooks/useCurriculum"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function CurriculumBuilder() {
  const { id: courseId } = useParams() as { id: string }
  const { 
    modules, 
    loading, 
    addModule, 
    updateModule, 
    deleteModule, 
    addLesson, 
    updateLesson, 
    deleteLesson 
  } = useCurriculum(courseId)

  const [newModuleName, setNewModuleName] = useState("")
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [tempTitle, setTempTitle] = useState("")

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium animate-pulse">Loading curriculum architecture...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
      <div className="space-y-6">
        {modules.map((mod, index) => (
          <Card key={mod.$id} className="border-border/50 bg-card/40 backdrop-blur shadow-sm group/module overflow-visible transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-4 flex-1">
                <div className="cursor-grab text-muted-foreground/30 hover:text-foreground transition-colors hidden sm:block">
                  <GripVertical className="w-5 h-5" />
                </div>
                {editingModuleId === mod.$id ? (
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <Input 
                      value={tempTitle} 
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="h-8 bg-background"
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-emerald-500" onClick={() => {
                       updateModule(mod.$id, { title: tempTitle })
                       setEditingModuleId(null)
                    }}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => setEditingModuleId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle 
                    className="text-lg font-bold cursor-text hover:text-primary transition-colors flex items-center gap-2"
                    onClick={() => {
                      setEditingModuleId(mod.$id)
                      setTempTitle(mod.title)
                    }}
                  >
                    <span className="text-muted-foreground font-mono text-sm opacity-50">#{index + 1}</span>
                    {mod.title}
                  </CardTitle>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10 hover:text-primary" onClick={() => addLesson(mod.$id, "New Lesson")}>
                  <Plus className="w-4 h-4 mr-2" /> Add Lesson
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => deleteModule(mod.$id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {mod.lessons?.map((lesson: any) => (
                  <div key={lesson.$id} className="flex flex-col group/lesson">
                    <div className={cn(
                      "flex items-center justify-between p-4 hover:bg-primary/5 transition-all border-l-4 border-transparent",
                      editingLessonId === lesson.$id && "bg-primary/5 border-primary"
                    )}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="cursor-grab text-muted-foreground/20 group-hover/lesson:text-muted-foreground transition-colors hidden sm:block">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          lesson.type === "video" ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                          {lesson.type === "video" ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold group-hover/lesson:text-primary transition-colors">{lesson.title}</p>
                          <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">{lesson.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={cn(editingLessonId === lesson.$id && "bg-primary text-primary-foreground")}
                          onClick={() => setEditingLessonId(lesson.$id === editingLessonId ? null : lesson.$id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteLesson(lesson.$id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Lesson Editor Area */}
                    {editingLessonId === lesson.$id && (
                      <div className="p-6 border-t border-border/30 bg-muted/30 animate-in slide-in-from-top-4 duration-300">
                        <div className="grid gap-6">
                           <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1 space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lesson Title</label>
                                 <Input 
                                    defaultValue={lesson.title} 
                                    onBlur={(e) => updateLesson(lesson.$id, { title: e.target.value })}
                                    className="bg-background border-border/50 focus:border-primary"
                                 />
                              </div>
                              <div className="w-full sm:w-48 space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</label>
                                 <select 
                                    className="w-full h-10 px-3 rounded-md bg-background border border-border/50 text-sm"
                                    defaultValue={lesson.type}
                                    onChange={(e) => updateLesson(lesson.$id, { type: e.target.value })}
                                 >
                                    <option value="video">Video</option>
                                    <option value="text">Article / Text</option>
                                 </select>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Media Upload</label>
                              <VideoUploader onUploadSuccess={(fileId) => updateLesson(lesson.$id, { videoFileId: fileId })} />
                           </div>
                           <div className="flex items-center gap-4 pt-4 border-t border-border/20">
                              <div className="flex items-center gap-2">
                                 <input 
                                    type="checkbox" 
                                    id={`free-${lesson.$id}`}
                                    defaultChecked={lesson.isFree}
                                    onChange={(e) => updateLesson(lesson.$id, { isFree: e.target.checked })}
                                    className="rounded border-border"
                                 />
                                 <label htmlFor={`free-${lesson.$id}`} className="text-sm font-medium">Free Preview</label>
                              </div>
                              <div className="flex items-center gap-2">
                                 <input 
                                    type="checkbox" 
                                    id={`pub-${lesson.$id}`}
                                    defaultChecked={lesson.isPublished}
                                    onChange={(e) => updateLesson(lesson.$id, { isPublished: e.target.checked })}
                                    className="rounded border-border"
                                 />
                                 <label htmlFor={`pub-${lesson.$id}`} className="text-sm font-medium">Published</label>
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="p-4 sm:hidden">
                  <Button variant="outline" className="w-full" onClick={() => addLesson(mod.$id, "New Lesson")}>
                    <Plus className="w-4 h-4 mr-2" /> Add Lesson
                  </Button>
                </div>
              </div>
              {(!mod.lessons || mod.lessons.length === 0) && (
                <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-2 italic">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                    <Plus className="opacity-20" />
                  </div>
                  No lessons in this section yet.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Module */}
      <Card className="border-dashed border-2 border-primary/20 bg-primary/5 shadow-none group/add transition-all hover:border-primary/40 hover:bg-primary/10">
        <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Module Name</label>
            <Input 
              placeholder="e.g. Masterclass: Advanced Database Indexing" 
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addModule(newModuleName) }}
              className="bg-background border-primary/20 focus:border-primary h-12 text-lg font-bold"
            />
          </div>
          <Button 
            onClick={() => {
              addModule(newModuleName)
              setNewModuleName("")
            }} 
            disabled={!newModuleName.trim()} 
            className="h-12 px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-3" /> Create Section
          </Button>
        </CardContent>
      </Card>
      
      {/* Visual Spacer */}
      <div className="h-20" />
    </div>
  )
}
