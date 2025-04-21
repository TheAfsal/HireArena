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
const inversify_1 = require("inversify");
const types_1 = require("../di/types");
let SubscriptionController = class SubscriptionController {
    constructor(subscriptionService) {
        this.subscriptionService = subscriptionService;
        this.create = async (req, res) => {
            try {
                const plan = await this.subscriptionService.createSubscriptionPlan(req.body.plan);
                res.status(201).json({ success: true, data: plan });
            }
            catch (error) {
                console.log(error);
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const updatedPlan = await this.subscriptionService.updateSubscriptionPlan(id, req.body.plan);
                if (!updatedPlan)
                    return res
                        .status(404)
                        .json({ success: false, message: "Plan not found" });
                res.json({ success: true, data: updatedPlan });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                await this.subscriptionService.deleteSubscriptionPlan(id);
                res.json({ success: true, message: "Plan deleted" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.getById = async (req, res) => {
            try {
                const { id } = req.params;
                const plan = await this.subscriptionService.getSubscriptionPlanById(id);
                if (!plan)
                    return res
                        .status(404)
                        .json({ success: false, message: "Plan not found" });
                res.json({ success: true, data: plan });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
        this.getAll = async (req, res) => {
            try {
                const plans = await this.subscriptionService.getAllSubscriptionPlans();
                res.json({ data: plans });
            }
            catch (error) {
                console.log(error);
                res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
        };
    }
};
SubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.SubscriptionService)),
    __metadata("design:paramtypes", [Object])
], SubscriptionController);
exports.default = SubscriptionController;
