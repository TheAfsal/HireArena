"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddCategoryModalProps {
  //   isOpen: boolean;
    onClose: () => void;
  onAddCategory: (categoryName: string, description: string) => void;
}

export const AddCategoryModal = ({ onAddCategory,onClose }: AddCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCategory = () => {
    if (categoryName && description) {
      onAddCategory(categoryName, description);
      setCategoryName("");
      setDescription("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" rounded-xl">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Category Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category Type</DialogTitle>
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
          <Button variant="link" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
