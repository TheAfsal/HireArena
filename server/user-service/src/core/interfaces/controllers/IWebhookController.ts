import { Request, Response } from "express";

export interface IWebhookController {
  handleWebhook(req: Request, res: Response): Promise<void>;
}
