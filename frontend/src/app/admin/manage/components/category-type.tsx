"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddCategoryModal } from "./add-category-type-modal";
import { EditCategoryModal } from "./edit-category-type-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AddCategoryType,
  EditCategoryType,
  fetchCategoryType,
} from "@/app/api/skills";

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

export default function CategoryTypesTable() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  const handleEditCategory = async (
    id: string,
    name: string,
    description: string,
    status: boolean
  ) => {
    try {
      const response = await EditCategoryType(name, description, id, status);
      setCategories(
        categories.map((category) =>
          category.id === response.id ? response : category
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCategory = async (name: string, description: string) => {
    try {
      const response = await AddCategoryType(name, description);
      console.log(response);
      setCategories([...categories, response]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getCategoryType = async () => {
      try {
        const response = await fetchCategoryType();
        setCategories(response);
      } catch (err) {
        //@ts-ignore
        console.log(err.message);
      }
    };

    getCategoryType();
  }, []);

  return (
    <div className="border rounded-2xl p-2">
      <div className="bg-orange-300 flex items-center justify-between mb-4 border p-3 rounded-2xl">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Job Categories Types</h1>
          <p className="text-muted-foreground text-sm">
            Job categories type help you organize your jobs and better match
            candidates.
          </p>
        </div>
        <AddCategoryModal onAddCategory={handleAddCategory} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Type Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>
                <span
                  className={`text-${
                    category.status ? "green" : "red"
                  }-600 font-bold`}
                >
                  {category.status ? "Active" : "InActive"}
                </span>
              </TableCell>
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
                <Button
                  variant="link"
                  className="text-red-600 p-0 ml-2"
                  onClick={() =>
                    handleEditCategory(
                      category.id,
                      category.name,
                      category.description,
                      !category.status
                    )
                  }
                >
                  {category.status ? "Suspend" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCategory && (
        <EditCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          category={selectedCategory}
          onEditCategory={handleEditCategory}
        />
      )}
    </div>
  );
}
