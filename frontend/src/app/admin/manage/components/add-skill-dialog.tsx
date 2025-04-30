"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function AddSkillDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill name</Label>
            <Input id="skillName" placeholder="React, Python, Design, etc..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryTech">Primary tech stack</Label>
              <Input id="primaryTech" placeholder="Search tech stacks" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryTech">Secondary tech stack</Label>
              <Input id="secondaryTech" placeholder="Search tech stacks" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobCategories">Job categories</Label>
            <Textarea id="jobCategories" placeholder="Product, Backend, Frontend, etc..." className="resize-none" />
          </div>
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


