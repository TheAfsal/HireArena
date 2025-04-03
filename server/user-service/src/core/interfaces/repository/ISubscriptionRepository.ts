import { IUserSubscription } from "@core/types/repository/schema.types";
import { Prisma, UserSubscription } from "@prisma/client";

export interface ISubscriptionRepository {
  createSubscription(data: IUserSubscription): Promise<IUserSubscription>;
  findActiveSubscription(userId: string): Promise<IUserSubscription | null>;
  // findSubscriptionByUserId(userId: string): Promise<IUserSubscription | null>;
  // updateSubscription(userId: string, data: Partial<IUserSubscription>): Promise<IUserSubscription>;
  getSubscriptionHistory(userId: string): Promise<IUserSubscription[]>;
  // getAllSubscriptions(): Promise<IUserSubscription[]>;
  countSubscriptions(): Promise<number>;
  getAllSubscriptions( skip: number, take: number ): Promise<IUserSubscription[]> 
}
