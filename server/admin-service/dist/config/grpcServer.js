"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const prismaClient_1 = __importDefault(require("./prismaClient"));
const PROTO_PATH = path_1.default.resolve(__dirname, "../proto/admin-service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const subscriptionProto = grpc.loadPackageDefinition(packageDefinition).adminService;
const subscriptionService = {
    async GetSubscriptionPlanById(call, callback) {
        try {
            const { planId } = call.request;
            const plan = await prismaClient_1.default.subscriptionPlan.findUnique({
                where: { id: planId },
            });
            console.log(plan);
            if (!plan) {
                return callback({
                    code: grpc.status.CANCELLED,
                    message: "Subscription plan not found",
                });
            }
            callback(null, {
                id: plan.id,
                name: plan.name,
                price: plan.price,
                duration: plan.duration,
                features: JSON.stringify(plan.features),
            });
        }
        catch (error) {
            console.error("Error fetching subscription plan:", error);
            callback({
                code: grpc.status.INTERNAL,
                message: "Internal Server Error",
            });
        }
    },
};
const server = new grpc.Server();
console.log(subscriptionProto);
server.addService(
//@ts-ignore
subscriptionProto.AdminService.service, { GetSubscriptionPlanById: subscriptionService.GetSubscriptionPlanById });
exports.default = server;
