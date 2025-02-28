import { Request, Response } from "express";
import Stripe from "stripe";
// import { SubscriptionService } from "../services/SubscriptionService";
import { TransactionService } from "../services/TransactionService";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

class WebhookController {
  static async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
    //   event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
      console.error("Webhook signature verification failed.", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { userId, planId, transactionId } = session.metadata;

        // Mark transaction as completed
        // await TransactionService.updateTransactionStatus(transactionId, "completed");

        // Create user subscription
        // await SubscriptionService.subscribeUser(userId, planId, transactionId);

        break;

      case "invoice.payment_failed":
        console.log("Payment failed:", event.data.object);
        break;
    }

    res.json({ received: true });
  }
}

export default WebhookController;