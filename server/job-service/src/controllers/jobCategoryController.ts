// src/controllers/JobCategoryController.ts
import { Request, Response } from "express";

export class JobCategoryController {
  private jobCategoryService: any;

  constructor(jobCategoryService: any) {
    this.jobCategoryService = jobCategoryService;
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, description, categoryTypeId } = req.body;
      const jobCategory = await this.jobCategoryService.createJobCategory(
        name,
        description,
        categoryTypeId
      );
      res.status(201).json(jobCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create job category" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id, name, description, status, categoryTypeId } = req.body;
      const updatedJobCategory =
        await this.jobCategoryService.updateJobCategory(
          id,
          name,
          description,
          status,
          categoryTypeId
        );
      res.status(200).json(updatedJobCategory);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Failed to update job category" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const jobCategory = await this.jobCategoryService.getJobCategory(
        Number(id)
      );
      if (jobCategory) {
        res.status(200).json(jobCategory);
      } else {
        res.status(404).json({ error: "Job category not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve job category" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const jobCategories = await this.jobCategoryService.getJobCategories();
      res.status(200).json(jobCategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve job categories" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.jobCategoryService.deleteJobCategory(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete job category" });
    }
  };
}
