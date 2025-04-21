"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async createCategory(name, description) {
        return await this.categoryRepository.create({
            name,
            description,
            status: true,
        });
    }
    async updateCategory(id, name, description, status) {
        return await this.categoryRepository.update(id, {
            name,
            description,
            status,
        });
    }
    async getCategory(id) {
        return await this.categoryRepository.findById(id);
    }
    async getCategories() {
        return await this.categoryRepository.findAll();
    }
    async deleteCategory(id) {
        await this.categoryRepository.delete(id);
    }
}
exports.CategoryService = CategoryService;
