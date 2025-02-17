"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface Category {
  id: string;
  name: string;
  description: string;
  categoryType: string;
}

export function AddJobCategoryModal({
  onAddJobCategory,
  categoryTypes,
}: {
  onAddJobCategory: (
    name: string,
    description: string,
    categoryType: string
  ) => void;
  categoryTypes: CategoryType[];
}) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName && description && categoryType) {
      onAddJobCategory(categoryName, description, categoryType);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl text-blue-700">
          Add Job Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Job Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryType">Category Type</Label>
            <select
              id="categoryType"
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category Type</option>
              {categoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="link" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EditJobCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    description: string;
    status: boolean;
    categoryType: string;
  };
  categoryTypes: CategoryType[];
  onEditCategory: (
    id: string,
    name: string,
    description: string,
    status: boolean,
    categoryType: string
  ) => void;
}

export const EditJobCategoryModal = ({
  isOpen,
  onClose,
  category,
  categoryTypes,
  onEditCategory,
}: EditJobCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [categoryType, setCategoryType] = useState(category.categoryType);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setDescription(category.description);
      setCategoryType(categoryTypes.find(
        (categoryType) => categoryType.name === category.categoryType
      )?.id as string);
    }
  }, [category]);

  const handleEditCategory = () => {
    if (categoryName && description && categoryType) {
      onEditCategory(
        category.id,
        categoryName,
        description,
        category.status,
        categoryType
      );
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Job Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category Description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryType">Category Type</Label>
            <select
              id="categoryType"
              value={categoryType}
              onChange={(e) => {
                console.log(e.target.value);
                setCategoryType(e.target.value);
              }}
              className="w-full p-2 border rounded"
            >
              {categoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AddJobCategory,
  EditJobCategory,
  fetchCategoryType,
  fetchJobCategory,
} from "@/app/api/skills";
import { CategoryType } from "./category-type";
import { toast } from "sonner";

export default function JobCategoryTable() {
  const [jobCategories, setJobCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryTypes = async () => {
      try {
        const response = await fetchCategoryType();
        setCategoryTypes(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    fetchCategoryTypes();
  }, []);

  useEffect(() => {
    const getJobCategory = async () => {
      try {
        const response = await fetchJobCategory();
        console.log(response);

        setJobCategories(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getJobCategory();
  }, []);

  const handleAddJobCategory = async (
    name: string,
    description: string,
    categoryType: string
  ) => {
    let response = await AddJobCategory(name, description, categoryType);
    console.log(response);
    console.log(response.categoryType.name);

    setJobCategories([
      ...jobCategories,
      { ...response, categoryType: response.categoryType.name },
    ]);
    toast.success("Category created successfully");
  };

  const handleEditJobCategory = async (
    id: string,
    name: string,
    description: string,
    status: boolean,
    categoryType: string
  ) => {
    let response = await EditJobCategory(
      id,
      name,
      description,
      status,
      categoryType
    );
    console.log(response);

    setJobCategories(
      jobCategories.map((category) =>
        category.id === response.id ? response : category
      )
    );
    toast.success("Category edited successfully");
  };

  return (
    <div className="border rounded-2xl p-2">
      <div className="bg-blue-400 flex items-center justify-between mb-4 border p-3 rounded-2xl">
        <div>
          <h1 className="text-2xl font-semibold mb-1 text-white">
            Job Categories
          </h1>
          <p className="text-muted-foreground text-sm text-white">
            Manage the job categories for your platform.
          </p>
        </div>
        <AddJobCategoryModal
          onAddJobCategory={handleAddJobCategory}
          categoryTypes={categoryTypes}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.categoryType}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="text-blue-600 p-0"
                  onClick={() => {
                    //@ts-ignore
                    setSelectedCategory(category);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCategory && (
        <EditJobCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
          categoryTypes={categoryTypes}
          onEditCategory={handleEditJobCategory}
        />
      )}
    </div>
  );
}
