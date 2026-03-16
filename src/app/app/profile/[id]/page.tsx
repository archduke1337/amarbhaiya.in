/**
 * @fileoverview Public user profile page.
 */
import { usersDb } from "@/lib/appwrite/database"

type Props = { params: Promise<{ id: string }> }

export default async function ProfilePage({ params }: Props) {
  const { id } = await params
  const user = await usersDb.get(id, true)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <p className="text-muted-foreground">User: {id}</p>
      <div className="rounded-lg border p-5">
        <p className="text-lg font-semibold">{(user as any).name || "Unnamed User"}</p>
        <p className="text-sm text-muted-foreground">{(user as any).email || "No email"}</p>
        <p className="mt-3 text-sm">{(user as any).bio || "No bio provided."}</p>
      </div>
    </div>
  )
}
