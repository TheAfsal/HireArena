import { Skill } from "@prisma/client";

export interface ISkillRepository {
  create(data: { name: string; jobCategoryId: string; status: boolean }): Promise<Skill>;
  update(id: string, data: { name: string; jobCategory: string; status: boolean }): Promise<Skill>;
  findById(id: string): Promise<Skill | null>;
  findAll(): Promise<any>;
  delete(id: string): Promise<void>;
}
