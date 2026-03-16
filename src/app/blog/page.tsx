/**
 * @fileoverview Blog listing — all published articles.
 */
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function BlogPage() {
  const posts = [
    { slug: "career-strategy-101", title: "Career Strategy 101", excerpt: "A practical roadmap for long-term growth." },
    { slug: "how-to-build-projects", title: "How To Build Projects", excerpt: "Turn learning into credible portfolio outcomes." },
    { slug: "interview-prep-system", title: "Interview Prep System", excerpt: "A repeatable framework for better interviews." },
  ]

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <p className="text-muted-foreground">Articles, guides, and insights.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border p-5 hover:bg-muted/40 transition-colors">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
