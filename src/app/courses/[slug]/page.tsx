/**
 * @fileoverview Course detail page — info, curriculum, enroll button.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

type Props = { params: Promise<{ slug: string }> }

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">Course: {slug}</h1>
        {/* TODO: CourseDetailHero, CurriculumAccordion, EnrollButton */}
      </main>
      <Footer />
    </>
  )
}
