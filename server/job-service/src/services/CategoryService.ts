import { ICategoryService } from "@core/interfaces/services/ICategoryService";
import CategoryRepository from "@repositories/CategoryRepository";

export class CategoryService implements ICategoryService{
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: any) {
    this.categoryRepository = categoryRepository;
  }

  createCategory = async (name: string, description: string) => {
    return await this.categoryRepository.create({
      name,
      description,
      status: true,
    });
  };

  async updateCategory(
    id: string,
    name: string,
    description: string,
    status: boolean
  ) {
    return await this.categoryRepository.update(id, {
      name,
      description,
      status,
    });
  }

  async getCategory(id: string) {
    return await this.categoryRepository.findById(id);
  }

  async getCategories() {
    return await this.categoryRepository.findAll();
  }

  async deleteCategory(id: string) {
    return await this.categoryRepository.delete(id);
  }
}
