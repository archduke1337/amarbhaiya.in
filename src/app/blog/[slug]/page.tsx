/**
 * @fileoverview Single blog post page.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <article className="prose dark:prose-invert max-w-3xl mx-auto">
          <h1>{slug}</h1>
          {/* TODO: Fetch and render blog content */}
        </article>
      </main>
      <Footer />
    </>
  )
}
