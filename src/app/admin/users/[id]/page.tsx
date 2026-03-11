/**
 * @fileoverview Admin user detail — profile, roles, activity, actions.
 */
type Props = { params: Promise<{ id: string }> }

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Detail</h1>
      <p className="text-muted-foreground mb-4">User ID: {id}</p>
      {/* TODO: UserProfile, RoleAssigner, ActivityLog */}
    </div>
  )
}
