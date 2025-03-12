import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";

interface SubscriptionTemplate {
  featuredProfile: boolean;
  resumeReview: boolean;
  premiumAlerts: boolean;
  unlimitedApplications: boolean;
  interviewMaterial: boolean;
  skillAssessments: boolean;
  careerCoaching: boolean;
  networkingEvents: boolean;
}

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

  async createSubscriptionPlan(plan: any): Promise<any> {
    const validatedFeatures: SubscriptionTemplate = this.allowedFeatures.reduce(
      (acc, feature) => {
        acc[feature] = plan.features[feature] === true;
        return acc;
      },
      {} as SubscriptionTemplate
    );

    const subscriptionData = {
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: validatedFeatures,
      status: plan.status || "active",
    };

    return await this.repository.create(subscriptionData);
  }

  async updateSubscriptionPlan(id: string, plan: any): Promise<any | null> {
    const validatedFeatures: SubscriptionTemplate = this.allowedFeatures.reduce(
      (acc, feature) => {
        acc[feature] = plan.features[feature] === true;
        return acc;
      },
      {} as SubscriptionTemplate
    );

    const updatedData = {
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: validatedFeatures,
      status: plan.status || "active",
    };

    return await this.repository.update(id, updatedData);
  }

  async deleteSubscriptionPlan(id: string): Promise<void> {
    return await this.repository.delete(id);
  }

  async getSubscriptionPlanById(id: string): Promise<any | null> {
    return await this.repository.getById(id);
  }

  async getAllSubscriptionPlans(): Promise<any[]> {
    return await this.repository.getAll();
  }
}
