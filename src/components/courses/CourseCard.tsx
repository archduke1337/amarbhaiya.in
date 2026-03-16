/**
 * @fileoverview CourseCard — A reusable course card with dynamic data.
 */
"use client"
import Link from "next/link"
import { Star, Clock, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface CourseCardProps {
  course: any
}

export function CourseCard({ course }: CourseCardProps) {
  const thumbnailSrc = course.thumbnailId 
    ? `/api/appwrite/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_COURSES}/files/${course.thumbnailId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    : null

  return (
    <Link href={`/courses/${course.$id}`} className="block group">
      <Card className="h-full overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {thumbnailSrc ? (
            <img 
              src={thumbnailSrc} 
              alt={course.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-violet-500/10" />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-background/90 backdrop-blur font-semibold">
              {course.level || "Beginner"}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-yellow-500 mb-2 text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{course.rating || "4.8"}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border/50">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || "Self-paced"}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {course.lessonsCount || 0} Lessons</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
