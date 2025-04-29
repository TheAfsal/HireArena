// src/controllers/SkillController.ts
import { ISkillController } from "@core/interfaces/controllers/ISkillController";
import { ISkillService } from "@core/interfaces/services/ISkillService";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class SkillController implements ISkillController {
  private skillService: ISkillService;

  constructor(skillService: ISkillService) {
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
      
      res.status(StatusCodes.CREATED).json(skill);
    } catch (error) {
      console.log(error);
      
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create skill" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id, name, jobCategories, experienceLevel, status } = req.body;
      const updatedSkill = await this.skillService.updateSkill(id, {
        name,
        //@ts-ignore
        jobCategories,
        experienceLevel,
        status,
      });
      res.status(StatusCodes.OK).json(updatedSkill);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to update skill" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //@ts-ignore
      const skill = await this.skillService.getSkill(Number(id));
      if (skill) {
        res.status(StatusCodes.OK).json(skill);
      } else {
        res.status(404).json({ error: "Skill not found" });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve skill" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const skills = await this.skillService.getSkills();
      res.status(StatusCodes.OK).json(skills);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve skills" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //@ts-ignore
      await this.skillService.deleteSkill(Number(id));
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete skill" });
    }
  };
}
