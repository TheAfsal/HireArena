import { ISkill } from "@shared/types/job.types";

export interface ISkillRepository {
  create(data: {
    name: string;
    jobCategoryId: string;
    status: boolean;
  }): Promise<ISkill>;
  update(
    id: string,
    data: { name: string; jobCategoryId: string; status: boolean }
  ): Promise<ISkill>;
  findById(id: string): Promise<ISkill | null>;
  findAll(): Promise<
    {
      id: string;
      name: string;
      status: boolean;
      jobCategory: string;
      createdAt: Date;
      modifiedAt: Date;
    }[]
  >;
  delete(id: string): Promise<void>;
}
