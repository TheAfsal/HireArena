"use client";

import { fetchSubscriptionsByAdmin } from "@/app/api/subscription";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const pageSize = 5; 

  const {
    data: subscriptionData,
    error,
    isLoading,
  } = useQuery<{ subscriptions: SubscriptionPlan[]; total: number }>({
    queryKey: ["subscriptions-history", page],
    queryFn: () => fetchSubscriptionsByAdmin(page, pageSize),
  });

  const subscriptions = subscriptionData?.subscriptions || [];
  const total = subscriptionData?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

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
        <p className="text-lg font-semibold">Subscription History</p>
        <p className="text-lg font-semibold">
          Total Revenue:{" "}
          <span className="text-green-600">${totalRevenue.toFixed(2)}</span>
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <p className="text-center text-gray-500">No subscriptions found</p>
      ) : (
        subscriptions.map((sub) => (
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
        ))
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { fetchSubscriptionsByAdmin } from "@/app/api/subscription";
// import { useQuery } from "@tanstack/react-query";

// export type SubscriptionPlan = {
//   id: string;
//   name: string;
//   price: number;
//   duration: string;
//   features: Record<string, boolean>;
//   status: string;
//   isActive: boolean;
//   expiryDate: Date;
// };

// export default function SubscriptionHistory() {
//   const {
//     data: subscriptions,
//     error,
//     isLoading,
//   } = useQuery<SubscriptionPlan[]>({
//     queryKey: ["subscriptions-history"],
//     queryFn: fetchSubscriptionsByAdmin,
//   });

//   if (isLoading)
//     return (
//       <p className="text-center text-gray-500">Loading subscriptions...</p>
//     );
//   if (error)
//     return (
//       <p className="text-center text-red-500">Error fetching subscriptions</p>
//     );

//   const totalRevenue =
//     subscriptions?.reduce((acc, sub) => acc + sub.price, 0) || 0;
//   const activeCount =
//     subscriptions?.filter((sub) => sub.status === "active").length || 0;

//   return (
//     <div className="space-y-6">
//       <div className="p-4 bg-gray-100 rounded-lg flex justify-between">
//         <p className="text-lg font-semibold">Subcription History</p>
//         <p className="text-lg font-semibold">
//           Total Revenue:{" "}
//           <span className="text-green-600">${totalRevenue.toFixed(2)}</span>
//         </p>
//       </div>

//       {subscriptions?.map((sub) => (
//         <div key={sub.id} className="border rounded-lg p-4 shadow-md">
//           <h3 className="text-lg font-semibold">{sub.name}</h3>
//           <p className="text-gray-700">
//             Price: <strong>${sub.price}</strong>
//           </p>
//           <p className="text-gray-700">
//             Duration:{" "}
//             {new Date(sub.expiryDate).toLocaleDateString("en-US", {
//               weekday: "short",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>

//           <p
//             className={`text-sm font-semibold ${
//               sub.isActive === true ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             Status: {sub.isActive ? "Active" : "Expired"}
//           </p>
//           <div className="mt-3">
//             <h4 className="font-medium">Features:</h4>
//             <ul className="list-disc pl-5 text-gray-600">
//               {Object.entries(sub.features).map(([feature, enabled]) =>
//                 enabled ? (
//                   <li key={feature}>{feature.replace(/([A-Z])/g, " $1")}</li>
//                 ) : null
//               )}
//             </ul>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
