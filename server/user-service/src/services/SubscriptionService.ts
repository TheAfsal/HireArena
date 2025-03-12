import "colors";
import Stripe from "stripe";
import { fetchSubscriptionPlan } from "../config/grpcClient";
import { UserSubscription } from "@prisma/client";
import { ISubscriptionService } from "@core/interfaces/services/ISubscriptionService";
import { ISubscriptionRepository } from "@core/interfaces/repository/ISubscriptionRepository";
import { IUserSubscription } from "@core/types/repository/schema.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class SubscriptionService implements ISubscriptionService {
  private subscriptionRepository: ISubscriptionRepository;
  constructor(subscriptionRepository: ISubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async subscribeUser(
    userId: string,
    planId: string,
    transactionId: string
  ): Promise<IUserSubscription> {
    const plan: any = await fetchSubscriptionPlan(planId);
    if (!plan) throw new Error("Subscription plan not found.");

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

  async fetchPlanDetails(userId: string): Promise< IUserSubscription | null> {
     return await this.subscriptionRepository.findActiveSubscription(userId);
  }

  async getSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
    return await this.subscriptionRepository.getSubscriptionHistory(userId);
  }

  async getAllSubscriptions():Promise<UserSubscription[]> {
    return await this.subscriptionRepository.getAllSubscriptions();
  }

  // async createSubscription(
  //   userId: string,
  //   plan: "BASIC" | "PRO" | "ENTERPRISE"
  // ) {
  //   const jobSeeker = await this.jobSeekerRepository.findById(userId);
  //   if (!jobSeeker) throw new Error("User not found");

  //   let subscription = await this.subscriptionRepository.findByUserId(userId);
  //   let customerId = subscription?.stripeCustomerId;

  //   console.log(jobSeeker);
  //   console.log(subscription);

  //   if (!customerId) {
  //     const customer = await stripe.customers.create({
  //       email: jobSeeker.email,
  //     });
  //     customerId = customer.id;

  //     await this.subscriptionRepository.createSubscription({
  //       jobSeekerId: userId,
  //       stripeCustomerId: customerId,
  //       plan,
  //     });
  //   }

  //   const planPrice = planPrices[plan]; // Get the price based on the selected plan

  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ["card"], // Specifies that the payment method will be via card
  //     mode: "subscription", // The checkout session is for a subscription
  //     customer: customerId, // Customer ID from the database or Stripe
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: "usd", // Currency for the payment
  //           product_data: {
  //             name: `${plan} Plan`, // Use the plan name (e.g., "Basic Plan")
  //           },
  //           unit_amount: planPrice, // Use the price corresponding to the selected plan
  //           recurring: {
  //             interval: "month", // Recurring monthly subscription
  //           },
  //         },
  //         quantity: 1, // Quantity of the subscription item
  //       },
  //     ],
  //     success_url: `${process.env.CLIENT_URL}/subscription-success`, // Redirect URL after successful payment
  //     cancel_url: `${process.env.CLIENT_URL}/subscription-cancelled`, // Redirect URL if payment is cancelled
  //   });

  //   return session.url;
  // }

  // async updateSubscriptionFromWebhook(subscriptionData: any) {
  //   await this.subscriptionRepository.updateSubscription(
  //     subscriptionData.customer,
  //     {
  //       stripeSubscriptionId: subscriptionData.id,
  //       status: subscriptionData.status.toUpperCase(),
  //       expiresAt: new Date(subscriptionData.current_period_end * 1000),
  //     }
  //   );
  // }

  // async subscribeUser(userId: string, planId: string, transactionId: string) {
  //   const plan: any = await fetchSubscriptionPlan(planId);

  //   if (!plan) {
  //     throw new Error("Subscription plan not found.");
  //   }

  //   const expiryDate = new Date();
  //   expiryDate.setDate(expiryDate.getDate() + plan.duration);

  //   const subscription = {
  //     userId,
  //     planId,
  //     features: JSON.parse(plan.features),
  //     startDate: new Date(),
  //     expiryDate,
  //     isActive: true,
  //     transactionId
  //   };

  //   return await this.subscriptionRepository.createSubscription(subscription);
  // }
}

export default SubscriptionService;
