import { ICategoryRepository } from "@core/interfaces/repository/ICategoryRepository";
import { ICategoryService } from "@core/interfaces/services/ICategoryService";
import { ICategoryType } from "@shared/types/job.types";

export class CategoryService implements ICategoryService {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async createCategory(
    name: string,
    description: string
  ): Promise<ICategoryType> {
    return await this.categoryRepository.create({
      name,
      description,
      status: true,
    });
  }

  async updateCategory(
    id: string,
    name: string,
    description: string,
    status: boolean
  ): Promise<ICategoryType> {
    return await this.categoryRepository.update(id, {
      name,
      description,
      status,
    });
  }

  async getCategory(id: string): Promise<ICategoryType | null> {
    return await this.categoryRepository.findById(id);
  }

  async getCategories(): Promise<ICategoryType[]> {
    return await this.categoryRepository.findAll();
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
