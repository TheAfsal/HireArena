import { Request, Response } from "express";
import { IJobCategoryController } from "@core/interfaces/controllers/IJobCategoryController";
import { IJobCategoryService } from "@core/interfaces/services/IJobCategoryService";
import { StatusCodes } from "http-status-codes";

export class JobCategoryController implements IJobCategoryController{
  private jobCategoryService: IJobCategoryService;

  constructor(jobCategoryService: IJobCategoryService) {
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
      res.status(StatusCodes.CREATED).json(jobCategory);
    } catch (error) {
      
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create job category";
    
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
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
      res.status(StatusCodes.OK).json(updatedJobCategory);
    } catch (error) {
      
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update job category";
    
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: errorMessage });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //@ts-ignore
      const jobCategory = await this.jobCategoryService.getJobCategory(Number(id));
      if (jobCategory) {
        res.status(StatusCodes.OK).json(jobCategory);
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Job category not found" });
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve job category" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const jobCategories = await this.jobCategoryService.getJobCategories();
      res.status(StatusCodes.OK).json(jobCategories);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to retrieve job categories" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      //@ts-ignore
      await this.jobCategoryService.deleteJobCategory(Number(id));
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete job category" });
    }
  };
}
