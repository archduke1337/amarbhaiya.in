/**
 * @fileoverview Public user profile page.
 */
type Props = { params: Promise<{ id: string }> }

export default async function ProfilePage({ params }: Props) {
  const { id } = await params

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground">User: {id}</p>
      {/* TODO: PublicProfileCard, ProfileEditForm */}
    </div>
  )
}
