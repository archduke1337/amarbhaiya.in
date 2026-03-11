/**
 * @fileoverview Admin panel layout — strict admin-only guard.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="admin">{children}</PanelLayout>
}
