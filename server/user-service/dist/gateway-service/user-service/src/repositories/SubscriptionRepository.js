"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        return await this.prisma.subscription.findUnique({
            where: { jobSeekerId: userId },
        });
    }
    async createSubscription(data) {
        //@ts-ignore
        return await this.prisma.subscription.create({ data });
    }
    async updateSubscription(userId, updateData) {
        return await this.prisma.subscription.updateMany({
            where: { jobSeekerId: userId },
            data: updateData,
        });
    }
}
exports.default = SubscriptionRepository;
