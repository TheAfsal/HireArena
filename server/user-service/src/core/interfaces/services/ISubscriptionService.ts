import { IUserSubscription } from "@core/types/repository/schema.types";

export interface ISubscriptionService {
    subscribeUser(userId: string, planId: string, transactionId: string): Promise<IUserSubscription>;
    fetchPlanDetails(userId: string): Promise<IUserSubscription | null > ;
    getSubscriptionHistory(userId: string): Promise<IUserSubscription[]>;
    // getAllSubscriptions(): Promise<IUserSubscription[]>;
    getAllSubscriptions( skip: number, take: number ): Promise<{ subscriptions: IUserSubscription[]; total: number }> 
  }
  