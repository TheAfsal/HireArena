import { Request, Response } from "express";
import { CategoryService } from "@services/CategoryService";
import { ICategoryController } from "@core/interfaces/controllers/ICategoryController";
import { ICategoryService } from "@core/interfaces/services/ICategoryService";
import { StatusCodes } from "http-status-codes";
export class CategoryController implements ICategoryController {
  private categoryService: ICategoryService;

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const category = await this.categoryService.createCategory(
        name,
        description
      );
      res.status(StatusCodes.CREATED).json(category);
    } catch (error) {
      
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create category";
    
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  };

  update = async (req: Request, res: Response) => {
    try {

      const { id, name, description, status } = req.body;
      console.log(id, name, description, status);

      const updatedCategory = await this.categoryService.updateCategory(
        id,
        name,
        description,
        status
      );
      res.status(StatusCodes.OK).json(updatedCategory);
    } catch (error) {   
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update category";
    
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.getCategory(id);
      if (category) {
        res.status(StatusCodes.OK).json(category);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Category not found" });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve category" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getCategories();
      res.status(StatusCodes.OK).json(categories);
    } catch (error) {
      console.log(error);

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve categories" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete category" });
    }
  };
}
