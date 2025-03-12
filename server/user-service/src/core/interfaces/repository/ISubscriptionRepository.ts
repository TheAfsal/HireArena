import { UserSubscription } from "@prisma/client";

export interface ISubscriptionRepository {
  createSubscription(data: any): Promise<any>;
  findActiveSubscription(userId: string): Promise<any | null>;
  findSubscriptionByUserId(userId: string): Promise<any | null>;
  updateSubscription(userId: string, data: any): Promise<any>;
  getSubscriptionHistory(userId: string): Promise<UserSubscription[]>;
  getAllSubscriptions(): Promise<UserSubscription[]>;
}
