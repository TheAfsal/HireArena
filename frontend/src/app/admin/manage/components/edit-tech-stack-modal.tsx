"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditTechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  techStack: { id: string; name: string; status: boolean };
  onEditTechStack: (id: string, name: string) => void;
}

export const EditTechStackModal = ({
  isOpen,
  onClose,
  techStack,
  onEditTechStack,
}: EditTechStackModalProps) => {
  const [name, setName] = useState(techStack.name);

  useEffect(() => {
    if (techStack) {
      setName(techStack.name);
    }
  }, [techStack]);

  const handleEditTechStack = () => {
    if (name) {
      onEditTechStack(techStack.id, name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tech Stack</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="techStackName">Tech Stack Name</Label>
            <Input
              id="techStackName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tech Stack Name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEditTechStack}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
