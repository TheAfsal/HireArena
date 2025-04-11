import { Request, Response } from "express";
import { IChatController } from "@core/interfaces/controllers/IVideoController";
import { IChatService } from "@core/interfaces/services/IChatService";
// import { IMessageDTO } from "@core/types/video.types";
import { IUser } from "@core/types/IUser";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";
import { getCompanyIdByUserId } from "@config/grpc.client";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.VideoService) private VideoService: IChatService) {}

  getUserConversations = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }

      // const conversations = await this.chatService.getUserConversations(userId);
      // res.status(200).json({ conversations, userId });
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  getUserConversationsCompany = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(400).json({ message: "userId is required" });
        return;
      }

      const companyId = await getCompanyIdByUserId(userId);

      if (!companyId) {
        res.status(400).json({ error: "Company ID is required" });
        return;
      }

      // const conversations = await this.chatService.getUserConversations(
      //   companyId
      // );
      // res.status(200).json({ conversations, companyId });
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };
}
