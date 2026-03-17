/**
 * @fileoverview Dynamic course categories management.
 */
import { Query } from "node-appwrite"
import { CategoryManager } from "@/components/admin/CategoryManager"
import { ROLES } from "@/config/roles"
import { categoriesDb, forumCategoriesDb } from "@/lib/appwrite/database"
import { getLoggedInUser } from "@/lib/appwrite/server"

export default async function AdminCategoriesPage() {
  const actor = await getLoggedInUser()
  if (!actor || !actor.labels.includes(ROLES.ADMIN)) {
    return <div className="text-sm text-destructive">Unauthorized</div>
  }

  try {
    const [courseCategoriesResult, forumCategoriesResult] = await Promise.all([
      categoriesDb.list({ queries: [Query.orderAsc("name")], limit: 100 }),
      forumCategoriesDb.list({ queries: [Query.orderAsc("order")], limit: 100 }),
    ])

    const courseCategories = courseCategoriesResult.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name || "",
      slug: doc.slug || "",
      isActive: doc.isActive,
      order: doc.order,
      createdAt: doc.$createdAt,
    }))

    const forumCategories = forumCategoriesResult.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name || "",
      slug: doc.slug || "",
      isActive: doc.isActive,
      order: doc.order,
      createdAt: doc.$createdAt,
    }))

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <CategoryManager courseCategories={courseCategories} forumCategories={forumCategories} />
      </div>
    )
  } catch (err) {
    console.error("[Admin] Failed to fetch categories:", err)
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load categories. Please try refreshing the page.
        </div>
      </div>
    )
  }
}
