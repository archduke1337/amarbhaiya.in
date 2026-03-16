/**
 * @fileoverview ScheduleSessionDialog — modal for instructors to create live events.
 */
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Plus } from "lucide-react"

export function ScheduleSessionDialog({ onSchedule }: { onSchedule: (data: any) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    duration: 60
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSchedule(formData)
    setLoading(false)
    setOpen(false)
    setFormData({ title: "", description: "", scheduledAt: "", duration: 60 })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 font-black shadow-xl shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" /> SCHEDULE SESSION
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border/50 bg-card/90 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Broadcast New Intelligence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Title</label>
            <Input 
              required
              placeholder="e.g., Advanced Microservices & Docker" 
              className="bg-background/50 border-white/5"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
            <Textarea 
              placeholder="What will the students learn?" 
              className="bg-background/50 border-white/5 resize-none h-24"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required
                  type="datetime-local" 
                  className="pl-9 bg-background/50 border-white/5"
                  value={formData.scheduledAt}
                  onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (Min)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required
                  type="number" 
                  className="pl-9 bg-background/50 border-white/5"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-black rounded-2xl transition-all hover:scale-[1.02]" disabled={loading}>
            {loading ? "SCHEDULING..." : "COMMIT TO CALENDAR"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
