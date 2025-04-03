import { IJobCategory } from "@shared/types/job.types";

export interface IJobCategoryService {
  createJobCategory(
    name: string,
    description: string,
    categoryTypeId: string
  ): Promise<IJobCategory>;
  updateJobCategory(
    id: string,
    name: string,
    description: string,
    status: boolean,
    categoryTypeId: string
  ): Promise<IJobCategory>;
  getJobCategory(id: string): Promise<IJobCategory | null>;
  getJobCategories(): Promise<IJobCategory[]>;
  deleteJobCategory(id: string): Promise<void>;
}
