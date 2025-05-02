"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPlans } from "@/app/api/subscription";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { SubscriptionDialog } from "./subscription-dialog";
import { SubscriptionPlan } from "../page";

function SubscriptionList() {
  const {
    data: plans,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: fetchPlans,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    );
  }

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans?.map((plan: SubscriptionPlan) => (
        <Card key={plan.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={plan.status === "active" ? "default" : "secondary"}
                >
                  {plan.status}
                </Badge>
                <SubscriptionDialog
                  mode="edit"
                  plan={plan}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">${plan.price}</p>
              <p className="text-muted-foreground">{plan.duration} days</p>
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default SubscriptionList;