/**
 * @fileoverview CourseCard — A reusable course card with dynamic data.
 */
"use client"
import Link from "next/link"
import Image from "next/image"
import { Clock, BookOpen, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { APPWRITE_CONFIG } from "@/config/appwrite"

interface CourseCardProps {
  course: any
}

function getThumbnailUrl(thumbnailId?: string): string | null {
  if (!thumbnailId) return null
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const bucketId = APPWRITE_CONFIG.buckets.courseThumbnails
  return `${endpoint}/storage/buckets/${bucketId}/files/${thumbnailId}/preview?project=${projectId}&width=600&height=340`
}

export function CourseCard({ course }: CourseCardProps) {
  const thumbnailUrl = getThumbnailUrl(course.thumbnailId) ?? course.thumbnailUrl

  return (
    <Link href={`/courses/${course.slug ?? course.$id}`} className="block group">
      <Card className="h-full overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
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
            {/* Only show rating if it actually exists */}
            {course.rating && course.rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-500 mb-2 text-xs font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>{course.rating}</span>
              </div>
            )}
            <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground pt-4 border-t border-border/50">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {course.duration || "Self-paced"}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> {course.lessonsCount || 0} Lessons
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
