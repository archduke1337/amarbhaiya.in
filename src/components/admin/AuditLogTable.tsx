/**
 * @fileoverview AuditLogTable - admin audit trail table.
 */

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AuditLogRow = {
  id: string
  userId: string
  action: string
  targetType: string
  targetId: string
  createdAt: string
}

type AuditLogTableProps = {
  logs: AuditLogRow[]
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No audit logs recorded yet.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>Actor</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Target ID</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              <Badge variant="outline" className="font-mono text-[10px] lowercase">
                {log.action}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">{log.userId}</TableCell>
            <TableCell className="capitalize">{log.targetType}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{log.targetId}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
