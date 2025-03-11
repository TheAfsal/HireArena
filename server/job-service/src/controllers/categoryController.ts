// src/controllers/CategoryController.ts
import { Request, Response } from "express";
import { CategoryService } from "@services/CategoryService";

export class CategoryController {
  private categoryService: CategoryService;

  constructor(categoryService: any) {
    this.categoryService = categoryService;
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const category = await this.categoryService.createCategory(
        name,
        description
      );
      res.status(201).json(category);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to create category" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      console.log("reaching update");
      
      const { id, name, description, status } = req.body;
      console.log(id, name, description, status);

      const updatedCategory = await this.categoryService.updateCategory(
        id,
        name,
        description,
        status
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategory(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve category" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ error: "Failed to retrieve categories" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  };
}
