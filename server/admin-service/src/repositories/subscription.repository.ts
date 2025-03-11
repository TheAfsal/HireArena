import prisma from "@config/prismaClient";
import { ISubscriptionRepository } from "../interfaces/ISubscriptionRepository";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(plan: any): Promise<any> {
    console.log("reaching create subscription");
    // console.log(prisma);
    console.log(plan.plan);

    return await prisma.subscriptionPlan.create({
      data: { ...plan },
    });
  }

  async update(id: string, plan: any): Promise<any | null> {
    return await prisma.subscriptionPlan.update({
      where: { id },
      data: { ...plan },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.subscriptionPlan.delete({
      where: { id },
    });
  }

  async getById(id: string): Promise<any | null> {
    return await prisma.subscriptionPlan.findUnique({
      where: { id },
    });
  }

  async getAll(): Promise<any[]> {
    return await prisma.subscriptionPlan.findMany({
      orderBy: {
        price: 'asc', // or 'desc' for descending order
      },
    });
  }
  
}
