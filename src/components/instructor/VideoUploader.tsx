/**
 * @fileoverview VideoUploader component with live Appwrite integration.
 */
"use client"

import { useState, useRef } from "react"
import { UploadCloud, FileVideo, X, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  onUploadSuccess?: (fileId: string) => void
}

export function VideoUploader({ onUploadSuccess }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile)
      setUploadProgress(0)
      setIsSuccess(false)
    } else {
      toast.error("Please select a valid video file.")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setIsUploading(true)
    setUploadProgress(10) // Initial progress

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate step-wise progress for UX while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 2 : prev))
      }, 300)

      const res = await fetch("/api/instructor/upload/video", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      
      const data = await res.json()
      
      if (res.ok) {
        setUploadProgress(100)
        setIsSuccess(true)
        toast.success("Video uploaded successfully!")
        if (onUploadSuccess) onUploadSuccess(data.fileId)
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      toast.error(error.message)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    setIsSuccess(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="w-full max-w-2xl bg-card/10 border border-border/50 rounded-[1.5rem] shadow-sm p-2">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-[1.2rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer min-h-[160px]",
            isDragging ? "border-primary bg-primary/5" : "border-border/30 hover:bg-muted/50 hover:border-primary/30"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            className="hidden"
            accept="video/*"
          />
          <div className="w-12 h-12 mb-3 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 group-hover:text-primary transition-colors">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-foreground font-bold text-sm text-center">
            Upload Lesson Video
          </p>
          <p className="text-muted-foreground text-xs mt-1 text-center font-medium opacity-60">
            MP4, WebM (Max. 2GB)
          </p>
        </div>
      ) : (
        <div className="border border-border/50 rounded-[1.2rem] p-4 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileVideo className="w-5 h-5" />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black truncate max-w-[150px] sm:max-w-sm" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-50">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && !isSuccess && (
              <button onClick={clearFile} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>

          {(isUploading || isSuccess) && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className={isSuccess ? "text-emerald-500" : "text-primary animte-pulse"}>
                  {isSuccess ? "Ready to Stream" : `Uploading... ${uploadProgress}%`}
                </span>
              </div>
              <Progress value={uploadProgress} className="h-1 bg-primary/10" />
            </div>
          )}

          {!isUploading && !isSuccess && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUpload} className="w-full sm:w-auto rounded-full font-black text-xs px-6 shadow-xl shadow-primary/20">
                START UPLOAD
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
