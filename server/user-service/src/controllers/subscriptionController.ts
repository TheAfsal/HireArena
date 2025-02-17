import { Request, Response } from "express";
import Stripe from "stripe";
import SubscriptionService from "../services/SubscriptionService";


class SubscriptionController {
  private subscriptionService: any;

  constructor(subscriptionService: SubscriptionService) {
    this.subscriptionService = subscriptionService;
  }

  createSubscription = async (req: Request, res: Response) => {
    try {
      const { plan } = req.body;
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const sessionUrl = await this.subscriptionService.createSubscription(
        userId,
        plan
      );

      res.json({ sessionUrl });
    } catch (error) {
        console.log(error);
        
      res.status(400).json({ error: (error as Error).message });
    }
  };
}

export default SubscriptionController;
