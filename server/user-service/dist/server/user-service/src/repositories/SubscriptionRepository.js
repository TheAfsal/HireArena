"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionRepository = void 0;
const client_1 = require("@prisma/client");
class SubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSubscription(data) {
        return await this.prisma.userSubscription.create({
            data: {
                ...data,
                features: data.features ?? client_1.Prisma.JsonNull,
            },
        });
    }
    async findActiveSubscription(userId) {
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
    async getSubscriptionHistory(userId) {
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
    async getAllSubscriptions(skip, take) {
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
            .filter(Boolean);
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
    async countSubscriptions() {
        return await this.prisma.userSubscription.count();
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
exports.default = SubscriptionRepository;
