import { Request, Response } from "express";
import { IChatController } from "@core/interfaces/controllers/IVideoController";
// import { IMessageDTO } from "@core/types/video.types";
import { IUser } from "@core/types/IUser";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";
import { Server, Socket } from "socket.io";
import { getCompanyIdByUserId } from "@config/grpc.client";
import { StatusCodes } from "http-status-codes";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.VideoService) private VideoService) {}

  getUserConversations = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        return;
      }

      // const conversations = await this.chatService.getUserConversations(userId);
      // res.status(StatusCodes.OK).json({ conversations, userId });
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };

  getUserConversationsCompany = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      if (!userId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "userId is required" });
        return;
      }

      const companyId = await getCompanyIdByUserId(userId);

      if (!companyId) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Company ID is required" });
        return;
      }

      // const conversations = await this.chatService.getUserConversations(
      //   companyId
      // );
      // res.status(StatusCodes.OK).json({ conversations, companyId });
      return;
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message });
      return;
    }
  };
}
