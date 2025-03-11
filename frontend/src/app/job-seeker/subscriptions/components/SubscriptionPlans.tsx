"use client";

import type React from "react";
import {
  createSubscription,
  fetchPlans,
  subscribe,
  fetchMySubscription,
  fetchSubscriptionHistory, // Add this function
} from "@/app/api/subscription";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubscriptionPlan } from "@/app/admin/subscription/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const SubscriptionPlans: React.FC = () => {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchPlans,
  });

  const { data: userSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["userSubscription"],
    queryFn: fetchMySubscription,
  });

  const {
    data: subscriptionHistory,
    isLoading: historyLoading,
    error: historyError,
  } = useQuery({
    queryKey: ["subscriptionHistory"],
    queryFn: fetchSubscriptionHistory,
  });

  const handleSubscription = async (planId: string) => {
    const data = await subscribe(planId);

    if (data.sessionUrl) {
      window.location.href = data.sessionUrl;
    } else {
      toast.error("Failed to create subscription");
    }
  };

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-6">
          <p className="text-destructive">Error loading subscription plans</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Choose Your Subscription Plan
            </h2>
            <p className="mt-4 text-xl text-text-sub-header">
              Get priority access to top companies with our subscription plans
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-3 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-10">
              {plans?.map((plan: SubscriptionPlan) => {
                const isSubscribed = userSubscription?.planId === plan.id;

                return (
                  <div key={plan.id} className="flex flex-col h-full">
                    <Card className="flex flex-col h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                plan.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {plan.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-2xl font-bold">${plan.price}</p>
                        <p className="text-muted-foreground">
                          {plan.duration} days
                        </p>
                        <div className="mt-4">
                          <p className="font-medium mb-2">Features:</p>
                          <ul className="space-y-1">
                            {Object.entries(plan.features)
                              .filter(([_, enabled]) => enabled)
                              .map(([feature]) => (
                                <li
                                  key={feature}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {feature.replace(/([A-Z])/g, " $1").trim()}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="mt-auto">
                        <button
                          type="button"
                          className={`w-full ${
                            userSubscription?.planId
                              ? "bg-gray-600"
                              : "bg-blue-500 hover:bg-blue-700"
                          } text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                          onClick={() => handleSubscription(plan.id)}
                          disabled={userSubscription?.planId ? true : false}
                        >
                          {isSubscribed ? "Already Subscribed" : "Subscribe"}
                        </button>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* Subscription History Section */}
          <div className="mt-16">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Your Subscription History
              </h2>
            </div>

            {historyLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-2/3 mb-4" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-1/3 mb-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
                {subscriptionHistory?.map((historyItem: any) => (
                  <div key={historyItem.id} className="flex flex-col h-full">
                    <Card className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle className="text-lg">
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-2xl font-bold">
                          ${historyItem.price}
                        </p>
                        <p className="text-muted-foreground">
                          Expiry:{" "}
                          {new Date(
                            historyItem.expiryDate
                          ).toLocaleDateString()}
                        </p>
                        <div className="mt-4">
                          <p className="font-medium mb-2">Features:</p>
                          <ul className="space-y-1">
                            {Object.entries(historyItem.features)
                              .filter(([_, enabled]) => enabled)
                              .map(([feature]) => (
                                <li
                                  key={feature}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {feature.replace(/([A-Z])/g, " $1").trim()}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
            {historyError && (
              <div className="text-center text-destructive mt-4">
                Failed to load subscription history
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPlans;

// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

// const SubscriptionPage = () => {
//   const [loading, setLoading] = useState(false);

//   const handleSubscription = async (plan: "BASIC" | "PRO" | "ENTERPRISE") => {
//     setLoading(true);

//     const response = await fetch("/api/subscribe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: "USER_ID_HERE", plan })
//     });

//     const data = await response.json();
//     setLoading(false);

//     if (data.sessionUrl) {
//       window.location.href = data.sessionUrl;
//     } else {
//       alert("Failed to create subscription");
//     }
//   };

//   return (
//     <div>
//       <h1>Choose a Subscription Plan</h1>
//       <button onClick={() => handleSubscription("BASIC")} disabled={loading}>Basic - $10/month</button>
//       <button onClick={() => handleSubscription("PRO")} disabled={loading}>Pro - $30/month</button>
//       <button onClick={() => handleSubscription("ENTERPRISE")} disabled={loading}>Enterprise - $50/month</button>
//     </div>
//   );
// };

// export default SubscriptionPage;

// import React, { useState, useEffect } from "react";

// const ProductDisplay = () => (
//   <section>
//     <div className="product">
//       <img
//         src="https://i.imgur.com/EHyR2nP.png"
//         alt="The cover of Stubborn Attachments"
//       />
//       <div className="description">
//       <h3>Stubborn Attachments</h3>
//       <h5>$20.00</h5>
//       </div>
//     </div>
//     <form action="http://localhost:5000/create-checkout-session" method="POST">
//       <button type="submit">
//         Checkout
//       </button>
//     </form>
//   </section>
// );

// //@ts-ignore
// const Message = ({ message }) => (
//   <section>
//     <p>{message}</p>
//   </section>
// );

// export default function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Check to see if this is a redirect back from Checkout
//     const query = new URLSearchParams(window.location.search);

//     if (query.get("success")) {
//       setMessage("Order placed! You will receive an email confirmation.");
//     }

//     if (query.get("canceled")) {
//       setMessage(
//         "Order canceled -- continue to shop around and checkout when you're ready."
//       );
//     }
//   }, []);

//   return message ? (
//     <Message message={message} />
//   ) : (
//     <ProductDisplay />
//   );
// }
