import { IJobCategoryService } from "@core/interfaces/services/IJobCategoryService";
import JobCategoryRepository from "@repositories/JobCategoryRepository";

export class JobCategoryService implements IJobCategoryService {
  private jobCategoryRepository: JobCategoryRepository;

  constructor(jobCategoryRepository: any) {
    this.jobCategoryRepository = jobCategoryRepository;
  }

  async createJobCategory(
    name: string,
    description: string,
    categoryTypeId: string
  ) {
    return await this.jobCategoryRepository.create({
      name,
      description,
      categoryTypeId,
      status: true,
    });
  }

  async updateJobCategory(
    id: string,
    name: string,
    description: string,
    status: boolean,
    categoryTypeId: string
  ) {
    return await this.jobCategoryRepository.update(id, {
      name,
      description,
      status,
      categoryTypeId,
    });
  }

  async getJobCategory(id: string) {
    return await this.jobCategoryRepository.findById(id);
  }

  async getJobCategories() {
    return await this.jobCategoryRepository.findAll();
  }

  async deleteJobCategory(id: string) {
    return await this.jobCategoryRepository.delete(id);
  }
}
