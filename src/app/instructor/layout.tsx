/**
 * @fileoverview Instructor panel layout — role guard for instructor | admin.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="instructor">{children}</PanelLayout>
}
