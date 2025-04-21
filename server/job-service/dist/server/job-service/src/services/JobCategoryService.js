"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobCategoryService = void 0;
class JobCategoryService {
    constructor(jobCategoryRepository) {
        this.jobCategoryRepository = jobCategoryRepository;
    }
    async createJobCategory(name, description, categoryTypeId) {
        return await this.jobCategoryRepository.create({
            name,
            description,
            categoryTypeId,
            status: true,
        });
    }
    async updateJobCategory(id, name, description, status, categoryTypeId) {
        return await this.jobCategoryRepository.update(id, {
            name,
            description,
            status,
            categoryTypeId,
        });
    }
    async getJobCategory(id) {
        return await this.jobCategoryRepository.findById(id);
    }
    async getJobCategories() {
        return await this.jobCategoryRepository.findAll();
    }
    async deleteJobCategory(id) {
        await this.jobCategoryRepository.delete(id);
    }
}
exports.JobCategoryService = JobCategoryService;
