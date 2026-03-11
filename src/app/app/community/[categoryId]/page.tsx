/**
 * @fileoverview Forum category page — threads listing.
 */
type Props = { params: Promise<{ categoryId: string }> }

export default async function ForumCategoryPage({ params }: Props) {
  const { categoryId } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Forum Category</h1>
      <p className="text-muted-foreground mb-8">Category: {categoryId}</p>
      {/* TODO: ThreadList, NewThreadButton */}
    </div>
  )
}
