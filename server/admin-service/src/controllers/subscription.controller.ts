import { Request, Response } from "express";
import { ISubscriptionController } from "@core/interfaces/controllers/ISubscriptionController";
import { inject, injectable } from "inversify";
import { TYPES } from "di/types";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { StatusCodes } from "http-status-codes";

@injectable()
class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const plan = await this.subscriptionService.createSubscriptionPlan(
        req.body.plan
      );

      res.status(StatusCodes.OK).json({ success: true, data: plan });
    } catch (error) {
      console.log(error);

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updatedPlan = await this.subscriptionService.updateSubscriptionPlan(
        id,
        req.body.plan
      );

      if (!updatedPlan)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: "Plan not found" });
      res.json({ success: true, data: updatedPlan });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.subscriptionService.deleteSubscriptionPlan(id);
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Plan deleted" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const plan = await this.subscriptionService.getSubscriptionPlanById(id);
      if (!plan)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: "Plan not found" });
      res.json({ success: true, data: plan });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const plans = await this.subscriptionService.getAllSubscriptionPlans();
      res.status(StatusCodes.OK).json({ data: plans });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: (error as Error).message });
    }
  };
}

export default SubscriptionController;
