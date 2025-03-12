import { Request, Response } from "express";

export interface ISubscriptionController {
  createCheckoutSession(req: Request, res: Response): Promise<void>;
  verifySubscription(req: Request, res: Response): Promise<void>;
  subscriptionDetails(req: Request, res: Response): Promise<void>;
  getSubscriptionHistory(req: Request, res: Response): Promise<void>;
}
