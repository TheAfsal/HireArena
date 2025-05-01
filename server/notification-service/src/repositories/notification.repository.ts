// src/repositories/notification.repository.ts
import { BaseRepository } from "./base.repository";
import NotificationModel, { INotification } from "../models/notification.model";

export interface INotificationRepository {
  createNotification(data: Partial<INotification>): Promise<INotification>;
  findByUserId(userId: string, page: number, pageSize: number): Promise<{
    notifications: INotification[];
    total: number;
  }>;
  markAsRead(notificationId: string): Promise<void>;
}

export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async createNotification(data: Partial<INotification>): Promise<INotification> {
    return this.create(data);
  }

  async findByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{
    notifications: INotification[];
    total: number;
  }> {
    const result = await this.find({ userId }, page, pageSize);
    return {
      notifications: result.data,
      total: result.total,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.update(notificationId, { read: true });
  }
}