"use client";

import { fetchSubscriptionsByAdmin } from "@/app/api/subscription";
import { useQuery } from "@tanstack/react-query";

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: Record<string, boolean>;
  status: string;
  isActive: boolean;
  expiryDate: Date;
};

export default function SubscriptionHistory() {
  const {
    data: subscriptions,
    error,
    isLoading,
  } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscriptions-history"],
    queryFn: fetchSubscriptionsByAdmin,
  });

  if (isLoading)
    return (
      <p className="text-center text-gray-500">Loading subscriptions...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500">Error fetching subscriptions</p>
    );

  const totalRevenue =
    subscriptions?.reduce((acc, sub) => acc + sub.price, 0) || 0;
  const activeCount =
    subscriptions?.filter((sub) => sub.status === "active").length || 0;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-100 rounded-lg flex justify-between">
        <p className="text-lg font-semibold">Subcription History</p>
        <p className="text-lg font-semibold">
          Total Revenue:{" "}
          <span className="text-green-600">${totalRevenue.toFixed(2)}</span>
        </p>
      </div>

      {subscriptions?.map((sub) => (
        <div key={sub.id} className="border rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-semibold">{sub.name}</h3>
          <p className="text-gray-700">
            Price: <strong>${sub.price}</strong>
          </p>
          <p className="text-gray-700">
            Duration:{" "}
            {new Date(sub.expiryDate).toLocaleDateString("en-US", {
              weekday: "short", 
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <p
            className={`text-sm font-semibold ${
              sub.isActive === true ? "text-green-600" : "text-red-600"
            }`}
          >
            Status: {sub.isActive ? "Active" : "Expired"}
          </p>
          <div className="mt-3">
            <h4 className="font-medium">Features:</h4>
            <ul className="list-disc pl-5 text-gray-600">
              {Object.entries(sub.features).map(([feature, enabled]) =>
                enabled ? (
                  <li key={feature}>{feature.replace(/([A-Z])/g, " $1")}</li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
