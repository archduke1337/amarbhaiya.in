/**
 * @fileoverview ModerationActionMenu — action menu for taking moderation steps on a user.
 */
"use client"

import { useState } from "react"
import { ShieldAlert, AlertTriangle, MicOff, Clock, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ActionType = "warn" | "mute" | "timeout" | "ban" | null

export function ModerationActionMenu({ userId }: { userId?: string }) {
  const [activeAction, setActiveAction] = useState<ActionType>(null)
  const [reason, setReason] = useState("")

  const handleAction = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for the audit log.")
      return
    }
    // Simulation logic (wiring to the API route in real prod)
    setActiveAction(null)
    setReason("")
    alert(`Action ${activeAction} successfully applied to user.`)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="destructive" className="gap-2 shadow-lg shadow-destructive/20">
            <ShieldAlert className="w-4 h-4" /> Moderate User
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 border-border/50">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveAction("warn")} className="gap-2 text-yellow-600 focus:text-yellow-600 cursor-pointer">
            <AlertTriangle className="w-4 h-4" /> Warn User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveAction("mute")} className="gap-2 text-orange-500 focus:text-orange-500 cursor-pointer">
            <MicOff className="w-4 h-4" /> Mute Permanently
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveAction("timeout")} className="gap-2 text-blue-500 focus:text-blue-500 cursor-pointer">
            <Clock className="w-4 h-4" /> 24h Timeout
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveAction("ban")} className="gap-2 text-destructive focus:text-destructive cursor-pointer">
            <UserX className="w-4 h-4" /> Ban Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={activeAction !== null} onOpenChange={(open) => !open && setActiveAction(null)}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-destructive" /> 
              Confirm Action: {activeAction?.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              This action will be heavily logged in the audit trail. Please provide a clear and objective reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input 
              placeholder="e.g. Repeatedly violating community guideline #3" 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveAction(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleAction} disabled={!reason.trim()}>
              Apply Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
