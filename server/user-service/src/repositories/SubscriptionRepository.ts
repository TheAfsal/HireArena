import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { IUserSubscription } from "@core/types/repository/schema.types";
import { Prisma, PrismaClient } from "@prisma/client";

export class SubscriptionRepository implements ISubscriptionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createSubscription(
    data: IUserSubscription
  ): Promise<IUserSubscription> {
    return await this.prisma.userSubscription.create({
      data: {
        ...data,
        features: data.features ?? Prisma.JsonNull,
      },
    });
  }

  async findActiveSubscription(
    userId: string
  ): Promise<IUserSubscription | null> {
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
        expiryDate: "desc",
      },
      take: 1,
    });

    return activeSubscriptions[0] || null;
  }

  // async findSubscriptionByUserId(userId: string): Promise<IUserSubscription | null> {
  //   return await this.prisma.userSubscription.findFirst({
  //     where: { userId },
  //   });
  // }

  // async updateSubscription(userId: string, data: Partial<IUserSubscription>): Promise<IUserSubscription> {
  //   return await this.prisma.userSubscription.update({
  //     where: { userId },
  //     data,
  //   });
  // }

  async getSubscriptionHistory(userId: string): Promise<IUserSubscription[]> {
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { userId },
      include: {
        jobSeeker: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const transactionIds = subscriptions
      .map((sub) => sub.transactionId)
      .filter(Boolean);

    const transactions = await this.prisma.transaction.findMany({
      where: { id: { in: transactionIds as string[] } },
      select: { id: true, amount: true },
    });

    const transactionMap = new Map(transactions.map((t) => [t.id, t.amount]));

    return subscriptions.map((sub) => ({
      ...sub,
      price: sub.transactionId
        ? transactionMap.get(sub.transactionId) || null
        : null,
    }));
  }

//   async getAllSubscriptions(): Promise<IUserSubscription[]> {
//     const subscriptions = await this.prisma.userSubscription.findMany({
//       include: {
//         jobSeeker: {
//           select: { fullName: true, email: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const transactionIds = subscriptions
//       .map((sub) => sub.transactionId)
//       .filter(Boolean);

//     const transactions = await this.prisma.transaction.findMany({
//       where: { id: { in: transactionIds as string[] } },
//       select: { id: true, amount: true },
//     });

//     const transactionMap = new Map(transactions.map((t) => [t.id, t.amount]));

//     return subscriptions.map((sub) => ({
//       ...sub,
//       price: sub.transactionId
//         ? transactionMap.get(sub.transactionId) || null
//         : null,
//     }));
//   }

async getAllSubscriptions(
  skip: number,
  take: number
): Promise<IUserSubscription[]> {
  const subscriptions = await this.prisma.userSubscription.findMany({
    skip,
    take,
    include: {
      jobSeeker: {
        select: { fullName: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const transactionIds = subscriptions
    .map((sub) => sub.transactionId)
    .filter(Boolean) as string[];

  const transactions = await this.prisma.transaction.findMany({
    where: { id: { in: transactionIds } },
    select: { id: true, amount: true },
  });

  const transactionMap = new Map(transactions.map((t) => [t.id, t.amount]));

  return subscriptions.map((sub) => ({
    ...sub,
    price: sub.transactionId
      ? transactionMap.get(sub.transactionId) || null
      : null,
  }));
}

async countSubscriptions(): Promise<number> {
  return await this.prisma.userSubscription.count();
}

}

export default SubscriptionRepository;
