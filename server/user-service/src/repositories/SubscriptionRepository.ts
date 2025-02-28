// import { PrismaClient } from "@prisma/client";

// class SubscriptionRepository {
//   private prisma: PrismaClient;

//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }
//   async findByUserId(userId: string) {
//     return await this.prisma.subscription.findUnique({
//       where: { jobSeekerId: userId },
//     });
//   }

//   async createSubscription(data: {
//     jobSeekerId: string;
//     stripeCustomerId: string;
//     plan: string;
//   }) {
//     //@ts-ignore
//     return await this.prisma.subscription.create({ data });
//   }

//   async updateSubscription(userId: string, updateData: any) {
//     return await this.prisma.subscription.updateMany({
//       where: { jobSeekerId: userId },
//       data: updateData,
//     });
//   }
// }

import { PrismaClient } from "@prisma/client";

export class SubscriptionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createSubscription(data: any) {
    return this.prisma.userSubscription.create({ data });
  }

  async findActiveSubscription(userId: string) {
    const today = new Date();
  
    const activeSubscriptions = await this.prisma.userSubscription.findMany({
      where: {
        userId,
        isActive: true,
        expiryDate: {
          gte: today,
        },
      },
      orderBy: {
        expiryDate: 'desc', 
      },
      take: 1,
    });
  
    return activeSubscriptions[0] || null;
  }
  

  async findSubscriptionByUserId(userId: string) {
    // return this.prisma.userSubscription.findUnique({ where: { userId } });
  }

  async updateSubscription(userId: string, data: any) {
    // return this.prisma.userSubscription.update({ where: { userId }, data });
  }
}

export default SubscriptionRepository;
