import { Request, Response } from "express";
import SubscriptionService from "@services/SubscriptionService";
import stripeLib from "stripe";
import { fetchSubscriptionPlan } from "@config/grpcClient";
import { UserSubscription } from "@prisma/client";
import { ISubscriptionController } from "@core/interfaces/controllers/ISubscriptionController";
const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY || "");

class SubscriptionController implements ISubscriptionController{
  private subscriptionService: any;
  private transactionService: any;

  constructor(
    subscriptionService: SubscriptionService,
    transactionService: any
  ) {
    this.subscriptionService = subscriptionService;
    this.transactionService = transactionService;
  }

  createCheckoutSession = async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;

      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const plan = await fetchSubscriptionPlan(planId);

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
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        message: "Failed to create checkout session",
        error: error.message,
      });
    }
  };

  verifySubscription = async (req: Request, res: Response) => {
    try {
      const { session_id } = req.query;
      if (!session_id) {
        res.status(400).json({ message: "Session ID is required" });
        return;
      }

      const session = await stripe.checkout.sessions.retrieve(
        session_id as string
      );
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

      const transaction = await this.transactionService.updateTransactionStatus(
        transactionId,
        "completed",
        session.id
      );

      const subscription = await this.subscriptionService.subscribeUser(
        userId,
        planId,
        transaction.id
      );

      res.status(200).json({ message: "Subscription activated", subscription });
      return;
    } catch (error) {
      console.log("Subscription Verification Error:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  subscriptionDetails = async (req: Request, res: Response) => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const subscription = await this.subscriptionService.fetchPlanDetails(
        userId
      );
      console.log(subscription);

      res
        .status(200)
        .json({ message: "Subscription fetching successful", ...subscription });
      return;
    } catch (error) {
      console.log("Fetching Subscription Error:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  getSubscriptionHistory = async (
    req: Request,
    res: Response
  ): Promise<any> => {
    try {
      const { userId } = req.headers["x-user"]
        ? JSON.parse(req.headers["x-user"] as string)
        : null;

      const subscriptions: UserSubscription[] =
        await this.subscriptionService.getSubscriptionHistory(userId);
      res.status(200).json({
        message: "Subscription history fetched successfully",
        subscriptions,
      });
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  };

  // createSubscription = async (req: Request, res: Response) => {
  //   try {
  //     const { plan } = req.body;
  //     const { userId } = req.headers["x-user"]
  //       ? JSON.parse(req.headers["x-user"] as string)
  //       : null;

  //     const sessionUrl = await this.subscriptionService.createSubscription(
  //       userId,
  //       plan
  //     );

  //     res.json({ sessionUrl });
  //   } catch (error) {
  //       console.log(error);

  //     res.status(400).json({ error: (error as Error).message });
  //   }
  // };

  // to delete
  // subscribe = async (req: Request, res: Response) => {
  //   try {
  //     const { userId, planId, paymentMethod } = req.body;

  //     const plan = await subscriptionService.fetchPlan(planId);
  //     if (!plan)
  //       return res
  //         .status(404)
  //         .json({ message: "Subscription plan not found." });

  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: plan.price * 100,
  //       currency: "usd",
  //       payment_method_types: ["card"],
  //     });

  //     const transaction = await transactionService.createPendingTransaction(
  //       userId,
  //       plan.price,
  //       paymentMethod,
  //       paymentIntent.id
  //     );

  //     const paymentConfirmation = await stripe.paymentIntents.confirm(
  //       paymentIntent.id
  //     );

  //     if (paymentConfirmation.status !== "succeeded") {
  //       await transactionService.updateTransactionStatus(
  //         transaction.transactionId,
  //         "failed"
  //       );
  //       return res.status(400).json({ message: "Payment failed." });
  //     }

  //     const subscription = await subscriptionService.subscribeUser(
  //       userId,
  //       planId,
  //       transaction.transactionId
  //     );
  //     await transactionService.updateTransactionStatus(
  //       transaction.transactionId,
  //       "completed",
  //       subscription.id
  //     );

  //     return res
  //       .status(200)
  //       .json({ message: "Subscription successful", subscription });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ message: "Subscription failed", error: (error as Error).message });
  //   }
  // };
}

export default SubscriptionController;
