import { ISkillService } from "@core/interfaces/services/ISkillService";
import { ISkillRepository } from "@core/interfaces/repository/ISkillRepository";
import { ISkill } from "@shared/job.types";

export class SkillService implements ISkillService {
  private skillRepository: ISkillRepository;

  constructor(skillRepository: ISkillRepository) {
    this.skillRepository = skillRepository;
  }

  async createSkill(data: { name: string; jobCategoryId: string; status: boolean }): Promise<ISkill> {
    return await this.skillRepository.create(data);
  }

  async updateSkill(id: string, data: { name: string; jobCategoryId: string; jobCategory: string; status: boolean }): Promise<ISkill> {
    return await this.skillRepository.update(id, data);
  }

  async getSkill(id: string): Promise<ISkill | null> {
    return await this.skillRepository.findById(id);
  }

  async getSkills(): Promise<Omit<ISkill, "jobCategoryId" >[]> {
    return await this.skillRepository.findAll();
  }

  async deleteSkill(id: string): Promise<void> {
    await this.skillRepository.delete(id);
  }
}
