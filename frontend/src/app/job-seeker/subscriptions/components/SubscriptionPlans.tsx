"use client";
import type React from "react";
import { CheckIcon } from "lucide-react";

type Plan = {
  name: string;
  price: number;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: 9.99,
    features: [
      "Access to basic companies",
      "Up to 10 job apply",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 29.99,
    features: [
      "All Basic features",
      "Unlimited job applying",
      "Priority candidate matching",
      "Phone support",
    ],
  },
  {
    name: "Enterprise",
    price: 99.99,
    features: [
      "All Pro features",
      "Custom branding",
      "API access",
      "Dedicated account manager",
    ],
  },
];

const SubscriptionPlans: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async (plan: string) => {
    setLoading(true);

    const data = await createSubscription(plan);
    setLoading(false);

    if (data.sessionUrl) {
      window.location.href = data.sessionUrl;
    } else {
      toast.error("Failed to create subscription");
    }
  };

  return (
    <div className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Subscription Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get priority access to top companies with our subscription plans
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-4 text-3xl font-extrabold text-gray-900">
                  ${plan.price.toFixed(2)}/mo
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckIcon className="flex-shrink-0 h-6 w-6 text-green-500" />
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-4">
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => handleSubscription(plan.name.toUpperCase())}
                  disabled={loading}
                >
                  Subscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

import { useState } from "react";
import { createSubscription } from "@/app/api/subscription";
import { toast } from "sonner";
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
