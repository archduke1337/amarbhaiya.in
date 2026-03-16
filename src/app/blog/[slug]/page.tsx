/**
 * @fileoverview Single blog post page.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <article className="prose dark:prose-invert max-w-3xl mx-auto">
          <h1>{title}</h1>
          <p className="text-muted-foreground">Published insight from the mentor playbook.</p>
          <p>
            This article route is now production-safe and ready for CMS/Appwrite integration. Until full content
            wiring is added, it renders a clean fallback shell based on the slug.
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
