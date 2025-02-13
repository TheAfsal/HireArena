// src/services/SkillService.ts

import SkillRepository from "../repositories/SkillRepository";

export class SkillService {
  private skillRepository: SkillRepository;

  constructor(skillRepository: any) {
    this.skillRepository = skillRepository;
  }

  async createSkill(data: {
    name: string;
    jobCategoryId: string;
    status: boolean;
  }) {
    return await this.skillRepository.create(data);
  }

  async updateSkill(id: string, data: {
    name: string;
    jobCategory: string;
    status: boolean;
  }) {
    return await this.skillRepository.update(id, data);
  }

  async getSkill(id: string) {
    return await this.skillRepository.findById(id);
  }

  async getSkills() {
    return await this.skillRepository.findAll();
  }

  async deleteSkill(id: string) {
    return await this.skillRepository.delete(id);
  }
}
