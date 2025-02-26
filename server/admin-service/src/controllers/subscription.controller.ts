import { Request, Response } from "express";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionRepository } from "../repositories/subscription.repository";

const repository = new SubscriptionRepository();
const subscriptionService = new SubscriptionService(repository);

class SubscriptionController {
  static async create(req: Request, res: Response) {
    try {
      const plan = await subscriptionService.createSubscriptionPlan(
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

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPlan = await subscriptionService.updateSubscriptionPlan(
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

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await subscriptionService.deleteSubscriptionPlan(id);
      res.json({ success: true, message: "Plan deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plan = await subscriptionService.getSubscriptionPlanById(id);
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

  static async getAll(req: Request, res: Response) {
    try {
      const plans = await subscriptionService.getAllSubscriptionPlans();
      res.json({ data: plans });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: (error as Error).message });
    }
  }
}

export default SubscriptionController;
