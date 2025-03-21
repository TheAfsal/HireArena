import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import {
  ISubscriptionPlan,
  ISubscriptionPlanCreateInput,
  ISubscriptionPlanInput,
  ISubscriptionPlanUpdateInput,
  SubscriptionTemplate,
} from "@core/types/subscription.types";
import { Prisma } from "@prisma/client";
import { TYPES } from "di/types";
import { inject, injectable } from "inversify";

@injectable()
export class SubscriptionService implements ISubscriptionService {
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

  constructor(
    @inject(TYPES.SubscriptionRepository)
    private subscriptionRepository: ISubscriptionRepository
  ) {}

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

    return await this.subscriptionRepository.create(subscriptionData);
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

    return await this.subscriptionRepository.update(id, updatedData);
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    return await this.subscriptionRepository.delete(id);
  }

  async getSubscriptionPlanById(id: string): Promise<ISubscriptionPlan | null> {
    return await this.subscriptionRepository.getById(id);
  }

  async getAllSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return await this.subscriptionRepository.getAll();
  }

  async getAlSubscriptionPlans(): Promise<ISubscriptionPlan[]> {
    return await this.subscriptionRepository.getAll();
  }
}

export default SubscriptionService;
