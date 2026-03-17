/**
 * @fileoverview Instructor panel layout.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export const dynamic = "force-dynamic"

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="instructor">{children}</PanelLayout>
}
