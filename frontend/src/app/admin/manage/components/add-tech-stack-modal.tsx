"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface AddTechStackModalProps {
  onAddTechStack: (name: string) => void;
}

export function AddTechStackModal({ onAddTechStack }: AddTechStackModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onAddTechStack(name);
      setOpen(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" rounded-xl">
          <PlusCircle className="mr-2 h-4 w-4" />Add New Tech Stack
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Tech Stack</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="techStackName">Tech Stack Name</Label>
            <Input
              id="techStackName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="React, Node.js, Python, etc..."
            />
          </div>
          <Button type="submit" className="w-full">
            Add Tech Stack
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
