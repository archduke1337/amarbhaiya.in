/**
 * @fileoverview Student area layout — session guard, sidebar, all roles allowed.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="student">{children}</PanelLayout>
}
