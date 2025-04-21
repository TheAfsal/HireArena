"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("colors");
const stripe_1 = __importDefault(require("stripe"));
const grpcClient_1 = require("../config/grpcClient");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
class SubscriptionService {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }
    async subscribeUser(userId, planId, transactionId) {
        const plan = await (0, grpcClient_1.fetchSubscriptionPlan)(planId);
        if (!plan)
            throw new Error("Subscription plan not found.");
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + plan.duration);
        const subscription = {
            userId,
            planId,
            features: JSON.parse(plan.features),
            startDate: new Date(),
            expiryDate,
            isActive: true,
            transactionId,
        };
        //@ts-ignore
        return await this.subscriptionRepository.createSubscription(subscription);
    }
    async fetchPlanDetails(userId) {
        return await this.subscriptionRepository.findActiveSubscription(userId);
    }
    async getSubscriptionHistory(userId) {
        return await this.subscriptionRepository.getSubscriptionHistory(userId);
    }
    // async getAllSubscriptions():Promise<UserSubscription[]> {
    //   return await this.subscriptionRepository.getAllSubscriptions();
    // }
    async getAllSubscriptions(skip, take) {
        const subscriptions = await this.subscriptionRepository.getAllSubscriptions(skip, take);
        const total = await this.subscriptionRepository.countSubscriptions();
        return { subscriptions, total };
    }
}
exports.default = SubscriptionService;
