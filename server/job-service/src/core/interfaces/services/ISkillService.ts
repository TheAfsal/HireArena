import { ISkill } from "@shared/job.types";

export interface ISkillService {
  createSkill(data: { name: string; jobCategoryId: string; status: boolean }): Promise<ISkill>;
  updateSkill(id: string, data: { name: string; jobCategory: string; status: boolean }): Promise<ISkill>;
  getSkill(id: string): Promise<ISkill | null>;
  getSkills(): Promise<Omit<ISkill, "jobCategoryId" >[]>;
  deleteSkill(id: string): Promise<void>;
}