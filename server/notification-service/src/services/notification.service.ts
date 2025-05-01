// src/services/notification.service.ts
import { INotificationRepository } from "../repositories/notification.repository";
import { INotification } from "../models/notification.model";

export interface INotificationService {
  createNotification(
    userId: string,
    message: string,
    type: INotification["type"],
    relatedId?: string
  ): Promise<INotification>;
  getNotifications(userId: string, page: number, pageSize: number): Promise<{
    notifications: INotification[];
    total: number;
  }>;
  markAsRead(notificationId: string): Promise<void>;
}

export class NotificationService implements INotificationService {
  constructor(private repository: INotificationRepository) {}

  createNotification = async (
    userId: string,
    message: string,
    type: INotification["type"],
    relatedId?: string
  ): Promise<INotification> => {
    return this.repository.createNotification({
      userId,
      message,
      type,
      read: false,
      relatedId,
    });
  };

  async getNotifications(userId: string, page: number, pageSize: number) {
    return this.repository.findByUserId(userId, page, pageSize);
  }

  async markAsRead(notificationId: string) {
    await this.repository.markAsRead(notificationId);
  }
}
