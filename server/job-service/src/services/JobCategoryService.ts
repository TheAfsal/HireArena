import { IJobCategoryService } from "@core/interfaces/services/IJobCategoryService";
import { IJobCategoryRepository } from "@core/interfaces/repository/IJobCategoryRepository";
import { IJobCategory } from "@shared/types/job.types";

export class JobCategoryService implements IJobCategoryService {
  private jobCategoryRepository: IJobCategoryRepository;

  constructor(jobCategoryRepository: IJobCategoryRepository) {
    this.jobCategoryRepository = jobCategoryRepository;
  }

  async createJobCategory(
    name: string,
    description: string,
    categoryTypeId: string
  ): Promise<IJobCategory> {
    const isExisting = await this.jobCategoryRepository.findOne(
      "name",
      name.trim()
    );

    if (isExisting) {
      throw new Error("Job Category already exist");
    }

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
  ): Promise<IJobCategory> {

    const isExisting = await this.jobCategoryRepository.findOne(
      "name",
      name.trim()
    );

    if (isExisting) {
      throw new Error("Job Category already exist");
    }

    return await this.jobCategoryRepository.update(id, {
      name,
      description,
      status,
      categoryTypeId,
    });
  }

  async getJobCategory(id: string): Promise<IJobCategory | null> {
    return await this.jobCategoryRepository.findById(id);
  }

  async getJobCategories(): Promise<IJobCategory[]> {
    return await this.jobCategoryRepository.findAll();
  }

  async deleteJobCategory(id: string): Promise<void> {
    await this.jobCategoryRepository.delete(id);
  }
}
