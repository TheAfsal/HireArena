import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { PrismaClient, UserSubscription } from "@prisma/client";

export class SubscriptionRepository implements ISubscriptionRepository{
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

  async getSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { userId },
      include: {
        jobSeeker: true,  
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch transactions for these subscriptions
    const transactionIds = subscriptions.map(sub => sub.transactionId).filter(Boolean);

    const transactions = await this.prisma.transaction.findMany({
      //@ts-ignore
      where: { id: { in: transactionIds } },
      select: { id: true, amount: true },
    });

    // Map transactions to subscriptions
    const transactionMap = new Map(transactions.map(t => [t.id, t.amount]));

    // Append price to subscription history
    return subscriptions.map(sub => ({
      ...sub,
      price: sub.transactionId ? transactionMap.get(sub.transactionId) || null : null
    }));

    // console.log(subscriptions);

    // return subscriptions;
  }

  async getAllSubscriptions() {
    const subscriptions = await this.prisma.userSubscription.findMany({
      include: {
        jobSeeker: {
          select: { fullName: true, email: true }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    const transactionIds = subscriptions.map(sub => sub.transactionId).filter(Boolean);

    const transactions = await this.prisma.transaction.findMany({
      //@ts-ignore
      where: { id: { in: transactionIds } },
      select: { id: true, amount: true },
    });

    const transactionMap = new Map(transactions.map(t => [t.id, t.amount]));

    return subscriptions.map(sub => ({
      ...sub,
      price: sub.transactionId ? transactionMap.get(sub.transactionId) || null : null
    }));
  }
}

export default SubscriptionRepository;

