/**
 * @fileoverview Moderator panel layout.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export const dynamic = "force-dynamic"

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="moderator">{children}</PanelLayout>
}
