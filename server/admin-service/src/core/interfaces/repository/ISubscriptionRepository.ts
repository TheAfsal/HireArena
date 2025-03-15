import { ISubscriptionPlan, ISubscriptionPlanCreateInput, ISubscriptionPlanUpdateInput } from "@core/types/subscription.types";

export interface ISubscriptionRepository {
  create(plan: ISubscriptionPlanCreateInput): Promise<ISubscriptionPlan>;
  update(id: string, plan: ISubscriptionPlanUpdateInput): Promise<ISubscriptionPlan>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<ISubscriptionPlan | null>;
  getAll(): Promise<ISubscriptionPlan[]>;
}
