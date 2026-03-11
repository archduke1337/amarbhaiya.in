/**
 * @fileoverview Moderator panel layout — role guard for moderator | admin.
 */
import { PanelLayout } from "@/components/layout/PanelLayout"

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
  return <PanelLayout panel="moderator">{children}</PanelLayout>
}
