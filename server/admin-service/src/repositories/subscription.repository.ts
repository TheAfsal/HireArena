import prisma from "@config/prismaClient";
import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { ISubscriptionPlan, ISubscriptionPlanCreateInput, ISubscriptionPlanUpdateInput } from "@core/types/subscription.types";
import { Prisma, PrismaClient } from "@prisma/client";

export class SubscriptionRepository implements ISubscriptionRepository {
  private prisma: PrismaClient = prisma;

  async create(plan: ISubscriptionPlanCreateInput): Promise<ISubscriptionPlan> {
    return await this.prisma.subscriptionPlan.create({
      data: { ...plan,features:plan.features?? Prisma.JsonNull },
    });
  }

  async update(
    id: string,
    plan: ISubscriptionPlanUpdateInput
  ): Promise<ISubscriptionPlan> {
    return await this.prisma.subscriptionPlan.update({
      where: { id },
      data: { ...plan,features:plan.features?? Prisma.JsonNull },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscriptionPlan.delete({
      where: { id },
    });
  }

  async getById(id: string): Promise<ISubscriptionPlan | null> {
    return await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<ISubscriptionPlan[]> {
    return await this.prisma.subscriptionPlan.findMany({
      orderBy: {
        price: "asc",
      },
    });
  }
}

export default SubscriptionRepository;