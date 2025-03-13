import { ICategoryType } from "@shared/job.types";

export interface ICategoryService {
  createCategory(name: string, description: string): Promise<ICategoryType>;
  updateCategory(id: string, name: string, description: string, status: boolean): Promise<ICategoryType>;
  getCategory(id: string): Promise<ICategoryType | null>;
  getCategories(): Promise<ICategoryType[]>;
  deleteCategory(id: string): Promise<void>;
}
