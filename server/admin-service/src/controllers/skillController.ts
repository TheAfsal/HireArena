// src/controllers/SkillController.ts
import { Request, Response } from "express";

export class SkillController {
  private skillService: any;

  constructor(skillService: any) {
    this.skillService = skillService;
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, jobCategoryId } = req.body;
      const skill = await this.skillService.createSkill({
        name,
        jobCategoryId,
        status: true,
      });
      
      res.status(201).json(skill);
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ error: "Failed to create skill" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id, name, jobCategories, experienceLevel, status } = req.body;
      const updatedSkill = await this.skillService.updateSkill(id, {
        name,
        jobCategories,
        experienceLevel,
        status,
      });
      res.status(200).json(updatedSkill);
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const skill = await this.skillService.getSkill(Number(id));
      if (skill) {
        res.status(200).json(skill);
      } else {
        res.status(404).json({ error: "Skill not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve skill" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const skills = await this.skillService.getSkills();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve skills" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.skillService.deleteSkill(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete skill" });
    }
  };
}
