import { UserSubscription } from "@prisma/client";

// Interfaces for SubscriptionService
export interface ISubscriptionService {
    subscribeUser(userId: string, planId: string, transactionId: string): Promise<any>;
    fetchPlanDetails(userId: string): Promise<any>;
    getSubscriptionHistory(userId: string): Promise<UserSubscription[]>;
    getAllSubscriptions(): Promise<any>;
  }
  