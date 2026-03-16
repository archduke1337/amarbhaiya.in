/**
 * @fileoverview CategoryManager - admin category overview tables.
 */

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type CategoryItem = {
  id: string
  name: string
  slug?: string
  isActive?: boolean
  order?: number
  createdAt?: string
}

type CategoryManagerProps = {
  courseCategories: CategoryItem[]
  forumCategories: CategoryItem[]
}

export function CategoryManager({ courseCategories, forumCategories }: CategoryManagerProps) {
  const renderRows = (rows: CategoryItem[]) => {
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="text-center text-muted-foreground">
            No categories found
          </TableCell>
        </TableRow>
      )
    }

    return rows.map((item) => (
      <TableRow key={item.id}>
        <TableCell className="font-medium">{item.name}</TableCell>
        <TableCell className="text-xs text-muted-foreground">{item.slug || "-"}</TableCell>
        <TableCell>{item.order ?? 0}</TableCell>
        <TableCell>
          <Badge variant={item.isActive === false ? "destructive" : "secondary"}>
            {item.isActive === false ? "Inactive" : "Active"}
          </Badge>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Course Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows(courseCategories)}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forum Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows(forumCategories)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
