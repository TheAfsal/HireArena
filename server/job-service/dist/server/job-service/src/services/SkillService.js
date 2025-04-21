"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillService = void 0;
class SkillService {
    constructor(skillRepository) {
        this.skillRepository = skillRepository;
    }
    async createSkill(data) {
        return await this.skillRepository.create(data);
    }
    async updateSkill(id, data) {
        return await this.skillRepository.update(id, data);
    }
    async getSkill(id) {
        return await this.skillRepository.findById(id);
    }
    async getSkills() {
        return await this.skillRepository.findAll();
    }
    async deleteSkill(id) {
        await this.skillRepository.delete(id);
    }
}
exports.SkillService = SkillService;
