/**
 * @fileoverview Course detail page — info, curriculum, enroll button.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { coursesDb } from "@/lib/appwrite/database"
import { Query } from "node-appwrite"

type Props = { params: Promise<{ slug: string }> }

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const result = await coursesDb.list({ queries: [Query.equal("slug", slug)], limit: 1 })
  const course = result.documents[0] as any

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">{course?.title || `Course: ${slug}`}</h1>
        <p className="text-muted-foreground mb-4">{course?.shortDescription || "Course details are loading soon."}</p>
        <div className="rounded-lg border p-5">
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="text-xl font-semibold">
            {Number(course?.price || 0).toLocaleString(undefined, { style: "currency", currency: "INR" })}
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
