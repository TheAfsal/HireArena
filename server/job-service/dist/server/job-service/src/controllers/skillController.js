"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillController = void 0;
class SkillController {
    constructor(skillService) {
        this.create = async (req, res) => {
            try {
                const { name, jobCategoryId } = req.body;
                const skill = await this.skillService.createSkill({
                    name,
                    jobCategoryId,
                    status: true,
                });
                res.status(201).json(skill);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: "Failed to create skill" });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id, name, jobCategories, experienceLevel, status } = req.body;
                const updatedSkill = await this.skillService.updateSkill(id, {
                    name,
                    //@ts-ignore
                    jobCategories,
                    experienceLevel,
                    status,
                });
                res.status(200).json(updatedSkill);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to update skill" });
            }
        };
        this.get = async (req, res) => {
            try {
                const { id } = req.params;
                //@ts-ignore
                const skill = await this.skillService.getSkill(Number(id));
                if (skill) {
                    res.status(200).json(skill);
                }
                else {
                    res.status(404).json({ error: "Skill not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Failed to retrieve skill" });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const skills = await this.skillService.getSkills();
                res.status(200).json(skills);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to retrieve skills" });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                //@ts-ignore
                await this.skillService.deleteSkill(Number(id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: "Failed to delete skill" });
            }
        };
        this.skillService = skillService;
    }
}
exports.SkillController = SkillController;
