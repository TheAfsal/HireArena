import { JobCategory } from "@prisma/client";

export interface IJobCategoryRepository {
  create(data: {
    name: string;
    description: string;
    categoryTypeId: string;
    status: boolean;
  }): Promise<JobCategory>;
  update(
    id: string,
    data: {
      name: string;
      description: string;
      status: boolean;
      categoryTypeId: string;
    }
  ): Promise<any>;
  findById(id: string): Promise<JobCategory | null>;
  findAll(): Promise<any>;
  delete(id: string): Promise<void>;
}
