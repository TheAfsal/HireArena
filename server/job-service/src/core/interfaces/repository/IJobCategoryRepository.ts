import { IJobCategory } from "@shared/job.types";

export interface IJobCategoryRepository {
  create(data: {
    name: string;
    description: string;
    categoryTypeId: string;
    status: boolean;
  }): Promise<Omit<IJobCategory, "jobs" | "skills">> ;
  update(
    id: string,
    data: {
      name: string;
      description: string;
      status: boolean;
      categoryTypeId: string;
    }
  ): Promise<any>;
  findById(id: string): Promise<Omit<IJobCategory, "categoryType" | "jobs" | "skills"> | null> ;
  findAll(): Promise<any>;
  delete(id: string): Promise<void>;
}
