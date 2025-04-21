"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = __importDefault(require("stripe"));
const grpcClient_1 = require("../config/grpcClient");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || "");
class SubscriptionController {
    constructor(subscriptionService, transactionService) {
        this.createCheckoutSession = async (req, res) => {
            try {
                const { planId } = req.body;
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const plan = await (0, grpcClient_1.fetchSubscriptionPlan)(planId);
                if (!plan) {
                    res.status(404).json({ message: "Plan not found" });
                    return;
                }
                const transaction = await this.transactionService.createTransaction({
                    userId,
                    //@ts-ignore
                    amount: Number.parseFloat(plan.price),
                    status: "pending",
                    paymentMethod: "stripe",
                });
                console.log("transaction-->", transaction);
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                product_data: {
                                    name: "plan.name",
                                    description: "plan.description",
                                },
                                //@ts-ignore
                                unit_amount: Number.parseFloat(plan.price) * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    payment_method_types: ["card"],
                    success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `http://localhost:3000/cancel`,
                    metadata: { userId, planId, transactionId: transaction.id },
                });
                res.json({ sessionUrl: session.url });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Failed to create checkout session",
                    error: error.message,
                });
            }
        };
        this.verifySubscription = async (req, res) => {
            try {
                const { session_id } = req.query;
                if (!session_id) {
                    res.status(400).json({ message: "Session ID is required" });
                    return;
                }
                const session = await stripe.checkout.sessions.retrieve(session_id);
                if (!session || session.payment_status !== "paid") {
                    res.status(400).json({ message: "Payment verification failed" });
                    return;
                }
                const userId = session.metadata?.userId;
                const planId = session.metadata?.planId;
                const transactionId = session.metadata?.transactionId;
                if (!userId || !planId) {
                    res.status(400).json({ message: "Invalid session metadata" });
                    return;
                }
                const transaction = await this.transactionService.updateTransactionStatus(transactionId, "completed", session.id);
                const subscription = await this.subscriptionService.subscribeUser(userId, planId, transaction.id);
                res.status(200).json({ message: "Subscription activated", subscription });
                return;
            }
            catch (error) {
                console.log("Subscription Verification Error:", error);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        };
        this.subscriptionDetails = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const subscription = await this.subscriptionService.fetchPlanDetails(userId);
                console.log(subscription);
                res
                    .status(200)
                    .json({ message: "Subscription fetching successful", ...subscription });
                return;
            }
            catch (error) {
                console.log("Fetching Subscription Error:", error);
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        };
        this.getSubscriptionHistory = async (req, res) => {
            try {
                const { userId } = req.headers["x-user"]
                    ? JSON.parse(req.headers["x-user"])
                    : null;
                const subscriptions = await this.subscriptionService.getSubscriptionHistory(userId);
                res.status(200).json({
                    message: "Subscription history fetched successfully",
                    subscriptions,
                });
                return;
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
                return;
            }
        };
        this.subscriptionService = subscriptionService;
        this.transactionService = transactionService;
    }
}
exports.default = SubscriptionController;
