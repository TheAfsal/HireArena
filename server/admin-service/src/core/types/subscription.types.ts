import { Prisma } from "@prisma/client";

export interface IJobSeeker {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: Prisma.JsonValue;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionPlanCreateInput {
  name: string;
  price: number;
  duration: number;
  features: Prisma.JsonValue;
  status?: string;
}

export interface ISubscriptionPlanUpdateInput {
  name?: string;
  price?: number;
  duration?: number;
  features?: Prisma.JsonValue;
  status?: string;
}


export interface SubscriptionTemplate {
  featuredProfile: boolean;
  resumeReview: boolean;
  premiumAlerts: boolean;
  unlimitedApplications: boolean;
  interviewMaterial: boolean;
  skillAssessments: boolean;
  careerCoaching: boolean;
  networkingEvents: boolean;
}

export interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: Prisma.JsonValue;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionPlanInput {
  name: string;
  price: number;
  duration: number;
  features: Partial<SubscriptionTemplate>;
  status?: string;
}
