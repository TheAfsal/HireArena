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
exports.SubscriptionRepository = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../di/types");
const inversify_1 = require("inversify");
let SubscriptionRepository = class SubscriptionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(plan) {
        return await this.prisma.subscriptionPlan.create({
            data: { ...plan, features: plan.features ?? client_1.Prisma.JsonNull },
        });
    }
    async update(id, plan) {
        return await this.prisma.subscriptionPlan.update({
            where: { id },
            data: { ...plan, features: plan.features ?? client_1.Prisma.JsonNull },
        });
    }
    async delete(id) {
        await this.prisma.subscriptionPlan.delete({
            where: { id },
        });
    }
    async getById(id) {
        return await this.prisma.subscriptionPlan.findUnique({
            where: { id },
        });
    }
    async getAll() {
        return await this.prisma.subscriptionPlan.findMany({
            orderBy: {
                price: "asc",
            },
        });
    }
};
exports.SubscriptionRepository = SubscriptionRepository;
exports.SubscriptionRepository = SubscriptionRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.PrismaClient)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SubscriptionRepository);
exports.default = SubscriptionRepository;
