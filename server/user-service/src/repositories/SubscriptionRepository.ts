import { PrismaClient } from "@prisma/client";

class SubscriptionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async findByUserId(userId: string) {
    return await this.prisma.subscription.findUnique({
      where: { jobSeekerId: userId },
    });
  }

  async createSubscription(data: {
    jobSeekerId: string;
    stripeCustomerId: string;
    plan: string;
  }) {
    //@ts-ignore
    return await this.prisma.subscription.create({ data });
  }

  async updateSubscription(userId: string, updateData: any) {
    return await this.prisma.subscription.updateMany({
      where: { jobSeekerId: userId },
      data: updateData,
    });
  }
}

export default SubscriptionRepository;
