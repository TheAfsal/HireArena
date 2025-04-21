"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const types_1 = require("../di/types");
const inversify_1 = require("inversify");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.allowedFeatures = [
            "featuredProfile",
            "resumeReview",
            "premiumAlerts",
            "unlimitedApplications",
            "interviewMaterial",
            "skillAssessments",
            "careerCoaching",
            "networkingEvents",
        ];
    }
    async createSubscriptionPlan(plan) {
        const validatedFeatures = this.allowedFeatures.reduce((acc, feature) => {
            acc[feature] = plan.features[feature] === true;
            return acc;
        }, {});
        const subscriptionData = {
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: validatedFeatures,
            status: plan.status || "active",
        };
        return await this.subscriptionRepository.create(subscriptionData);
    }
    async updateSubscriptionPlan(id, plan) {
        const validatedFeatures = this.allowedFeatures.reduce((acc, feature) => {
            acc[feature] = plan.features[feature] === true;
            return acc;
        }, {});
        const updatedData = {
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: validatedFeatures,
            status: plan.status || "active",
        };
        return await this.subscriptionRepository.update(id, updatedData);
    }
    async deleteSubscriptionPlan(id) {
        return await this.subscriptionRepository.delete(id);
    }
    async getSubscriptionPlanById(id) {
        return await this.subscriptionRepository.getById(id);
    }
    async getAllSubscriptionPlans() {
        return await this.subscriptionRepository.getAll();
    }
    async getAlSubscriptionPlans() {
        return await this.subscriptionRepository.getAll();
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SubscriptionRepository)),
    __metadata("design:paramtypes", [Object])
], SubscriptionService);
exports.default = SubscriptionService;
