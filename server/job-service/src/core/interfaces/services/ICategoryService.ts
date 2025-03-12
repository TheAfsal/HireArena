export interface ICategoryService {
  createCategory(name: string, description: string): Promise<any>;
  updateCategory(
    id: string,
    name: string,
    description: string,
    status: boolean
  ): Promise<any>;
  getCategory(id: string): Promise<any | null>;
  getCategories(): Promise<any[]>;
  deleteCategory(id: string): Promise<void>;
}
