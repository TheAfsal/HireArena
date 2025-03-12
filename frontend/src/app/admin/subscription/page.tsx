"use client";

import SubscriptionList from "./components/subscription-list";
import { SubscriptionDialog } from "./components/subscription-dialog";
import SubscriptionHistory from "./components/subscription-history";

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: Record<string, boolean>;
  status: string;
};

export type CreateSubscriptionData = Omit<SubscriptionPlan, "id">;



export default function AdminSubscriptions() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage Subscription Plans</h1>
        <SubscriptionDialog mode="create" />
      </div>
      <div className="mt-8">
        <h2 className="flex flex-col justify-center text-xl font-semibold mb-4">
          Existing Plans
        </h2>
        <SubscriptionList />
        <div className=" border rounded-xl p-5 mt-10">
          <SubscriptionHistory />
        </div>
      </div>
    </div>
  );
}
