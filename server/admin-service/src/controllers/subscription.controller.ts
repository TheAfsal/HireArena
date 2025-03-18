import { Request, Response } from "express";
import { ISubscriptionController } from "@core/interfaces/controllers/ISubscriptionController";
import { inject, injectable } from "inversify";
import { TYPES } from "di/types";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";

@injectable()
class SubscriptionController implements ISubscriptionController {

  constructor(
    @inject(TYPES.SubscriptionService) private subscriptionService: ISubscriptionService
  ) {}

  async create(req: Request, res: Response) {
    try {
      const plan = await this.subscriptionService.createSubscriptionPlan(
        req.body.plan
      );

      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPlan = await this.subscriptionService.updateSubscriptionPlan(
        id,
        req.body.plan
      );

      if (!updatedPlan)
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      res.json({ success: true, data: updatedPlan });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.subscriptionService.deleteSubscriptionPlan(id);
      res.json({ success: true, message: "Plan deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plan = await this.subscriptionService.getSubscriptionPlanById(id);
      if (!plan)
        return res
          .status(404)
          .json({ success: false, message: "Plan not found" });
      res.json({ success: true, data: plan });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const plans = await this.subscriptionService.getAllSubscriptionPlans();
      res.json({ data: plans });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }
}

export default SubscriptionController;
