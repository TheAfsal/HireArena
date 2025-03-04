import "colors";
import Stripe from "stripe";
import SubscriptionRepository from "../repositories/SubscriptionRepository";
import { fetchSubscriptionPlan } from "../config/grpcClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// const planPrices = {
//   BASIC: 1000, // $10.00 for BASIC plan
//   PRO: 2999, // $29.99 for PRO plan
//   ENTERPRISE: 9999, // $99.99 for ENTERPRISE plan
// };

class SubscriptionService {
  private subscriptionRepository: SubscriptionRepository;
  constructor(subscriptionRepository: SubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async subscribeUser(userId: string, planId: string, transactionId: string) {
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

    return await this.subscriptionRepository.createSubscription(subscription);
  }

  async fetchPlanDetails(userId: string) {
    return await this.subscriptionRepository.findActiveSubscription(userId);
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
