"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
exports.TYPES = {
    // Controller
    SubscriptionController: Symbol.for('SubscriptionController'),
    AdminController: Symbol.for('AdminController'),
    // Service
    SubscriptionService: Symbol.for('SubscriptionService'),
    JobSeekerService: Symbol.for('JobSeekerService'),
    // Repository
    SubscriptionRepository: Symbol.for('SubscriptionRepository'),
    AdminRepository: Symbol.for('AdminRepository'),
    // Prisma
    PrismaClient: Symbol.for("PrismaClient"),
};
