import * as grpc from "@grpc/grpc-js";
import { Request, Response } from "express";
import { INotificationService } from "@services/notification.service";
import { INotification } from "@models/notification.model";
import { INotificationController } from "@core/interfaces/controllers/INotificationController";
import { StatusCodes } from "http-status-codes";

class NotificationController implements INotificationController {
  constructor(private notificationService: INotificationService) {}

  createNotification = async (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    try {
      const { userId, message, type, relatedId } = call.request;

      console.log(userId, message, type, relatedId);
      if (!userId || !message || !type) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "Missing required fields: userId, message, or type",
        });
      }

      const validTypes: INotification["type"][] = [
        "INTERVIEW_SCHEDULED",
        "JOB_APPLICATION",
        "INTERVIEW_COMPLETED",
        "GENERAL",
      ];

      if (!validTypes.includes(type)) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: `Invalid notification type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        });
      }

      console.log(this.notificationService);

      const notification = await this.notificationService.createNotification(
        userId,
        message,
        type as INotification["type"],
        relatedId
      );

      callback(null, {
        notification: {
          //@ts-ignore
          id: notification._id.toString(),
          userId: notification.userId,
          message: notification.message,
          type: notification.type,
          read: notification.read,
          createdAt: notification.createdAt.toISOString(),
          relatedId: notification.relatedId,
        },
      });
    } catch (error) {
      console.log("Error creating notification:", error);
      callback({
        code: grpc.status.INTERNAL,
        message: (error as Error).message || "Failed to create notification",
      });
    }
  };

  getCandidateNotifications = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;
      const { page, pageSize } = req.query;

      if (!userId) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({
            success: false,
            message: "userId is required in request body",
          });
        return;
      }

      console.log(
        `Fetching notifications for user ${userId}, page ${page}, pageSize ${pageSize}`
      );

      const result = await this.notificationService.getNotifications(
        userId,
        parseInt(page as string, 10),
        parseInt(pageSize as string, 10)
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: result.notifications.map((n: any) => ({
          _id: n.id,
          userId: n.userId,
          message: n.message,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt,
          relatedId: n.relatedId,
        })),
        pagination: {
          total: result.total,
          page: page,
          pageSize: pageSize,
        },
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to fetch notifications",
      });
    }
  };

  markNotificationAsRead = async (req: Request, res: Response) => {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "notificationId is required" });
        return;
      }

      console.log(`Marking notification ${notificationId} as read`);

      await this.notificationService.markAsRead(notificationId);

      res
        .status(StatusCodes.OK)
        .json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          (error as Error).message || "Failed to mark notification as read",
      });
    }
  };
}

export default NotificationController;
