/**
 * @fileoverview Student panel layout.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export const dynamic = "force-dynamic"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="student">{children}</PanelLayout>
}
