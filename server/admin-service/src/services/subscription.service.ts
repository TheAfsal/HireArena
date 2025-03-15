import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { ISubscriptionPlan, ISubscriptionPlanCreateInput, ISubscriptionPlanInput, ISubscriptionPlanUpdateInput, SubscriptionTemplate } from "@core/types/subscription.types";
import { Prisma } from "@prisma/client";


// export interface ISubscriptionService {
//   createSubscriptionPlan(plan: ISubscriptionPlanInput): Promise<ISubscriptionPlan>;
//   updateSubscriptionPlan(
//     id: string,
//     plan: ISubscriptionPlanInput
//   ): Promise<ISubscriptionPlan>;
//   deleteSubscriptionPlan(id: string): Promise<void>;
//   getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null>;
//   getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]>;
// }

export class SubscriptionService implements ISubscriptionService {
  private repository: ISubscriptionRepository;

  private allowedFeatures: (keyof SubscriptionTemplate)[] = [
    "featuredProfile",
    "resumeReview",
    "premiumAlerts",
    "unlimitedApplications",
    "interviewMaterial",
    "skillAssessments",
    "careerCoaching",
    "networkingEvents",
  ];

  constructor(repository: ISubscriptionRepository) {
    this.repository = repository;
  }

  async createSubscriptionPlan(
    plan: ISubscriptionPlanInput
  ): Promise<ISubscriptionPlan> {
    const validatedFeatures: SubscriptionTemplate = this.allowedFeatures.reduce(
      (acc, feature) => {
        acc[feature] = plan.features[feature] === true;
        return acc;
      },
      {} as SubscriptionTemplate
    );

    const subscriptionData: ISubscriptionPlanCreateInput = {
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: validatedFeatures as unknown as Prisma.JsonValue, 
      status: plan.status || "active",
    };

    return await this.repository.create(subscriptionData);
  }

  async updateSubscriptionPlan(
    id: string,
    plan: ISubscriptionPlanInput
  ): Promise<ISubscriptionPlan> {
    const validatedFeatures: SubscriptionTemplate = this.allowedFeatures.reduce(
      (acc, feature) => {
        acc[feature] = plan.features[feature] === true;
        return acc;
      },
      {} as SubscriptionTemplate
    );

    const updatedData: ISubscriptionPlanUpdateInput = {
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: validatedFeatures as unknown as Prisma.JsonValue,
      status: plan.status || "active",
    };

    return await this.repository.update(id, updatedData);
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null> {
    return await this.repository.getById(id);
  }

  async getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return await this.repository.getAll();
  }
}

export default SubscriptionService;