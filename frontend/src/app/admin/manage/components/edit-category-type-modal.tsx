"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { id: string; name: string; description: string; status: boolean };
  onEditCategory: (
    id: string,
    name: string,
    description: string,
    status: boolean
  ) => void;
}

export const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  onEditCategory,
}: EditCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [description, setDescription] = useState(category.description);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  const handleEditCategory = () => {
    if (categoryName && description) {
      onEditCategory(category.id, categoryName, description, category.status);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category Type</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full p-2 border rounded-md"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Category Description"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <DialogFooter>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEditCategory}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
