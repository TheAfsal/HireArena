"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skill } from "../page"

interface EditSkillDialogProps {
  children: React.ReactNode
  skill: Skill
}

const techStacks = ["React.js", "Vue.js", "Angular", "JQuery", "Vanilla JS"]
const jobCategories = ["Frontend Developer", "UI/UX Designer", "Fullstack Developer", "Product Manager"]

export function EditSkillDialog({ children, skill }: EditSkillDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input id="skillName" defaultValue={skill.name} />
          </div>
          <div className="space-y-2">
            <Label>Tech Stacks</Label>
            <div className="flex flex-wrap gap-2">
              {techStacks.map((tech) => (
                <Button
                  key={tech}
                  type="button"
                  variant={selectedTechStacks.includes(tech) ? "default" : "secondary"}
                  onClick={() => {
                    setSelectedTechStacks((prev) =>
                      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech],
                    )
                  }}
                  className="rounded-full"
                >
                  {tech}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Job Categories</Label>
            <div className="flex flex-wrap gap-2">
              {jobCategories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategories.includes(category) ? "default" : "secondary"}
                  onClick={() => {
                    setSelectedCategories((prev) =>
                      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
                    )
                  }}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

