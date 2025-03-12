"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createSubscription, updateSubscription } from "@/app/api/subscription";
import { useEffect } from "react";
import {
  CreateSubscriptionData,
  SubscriptionPlan,
} from "../page";

const availableFeatures = [
  "featuredProfile",
  "resumeReview",
  "premiumAlerts",
  "unlimitedApplications",
  "interviewMaterial",
  "skillAssessments",
  "careerCoaching",
  "networkingEvents",
];
interface SubscriptionFormProps {
  mode: "create" | "edit";
  plan?: SubscriptionPlan;
  onSuccess?: () => void;
}

function SubscriptionForm({ mode, plan, onSuccess }: SubscriptionFormProps) {
  
  const { register, handleSubmit, reset, setValue, watch } =
  useForm<CreateSubscriptionData>({
    defaultValues: {
      features: availableFeatures.reduce((acc, feature) => {
        acc[feature] = false;
        return acc;
      }, {} as Record<string, boolean>),
      status: mode === "edit" ? "active" : undefined,
    },
  });
  
  const queryClient = useQueryClient();
  const watchedFeatures = watch("features", {});
  const watchedStatus = watch("status");

  useEffect(() => {
    if (mode === "edit" && plan) {
      setValue("name", plan.name);
      setValue("price", plan.price);
      setValue("duration", plan.duration);
      setValue("status", plan.status);

      Object.entries(plan.features).forEach(([feature, enabled]) => {
        setValue(`features.${feature}`, enabled);
      });
    }
  }, [mode, plan, setValue]);

  const createMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      toast.success("Subscription plan created successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create subscription plan");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSubscription,
    onSuccess: () => {
      toast.success("Subscription plan updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update subscription plan");
    },
  });

  const onSubmit = async (data: CreateSubscriptionData) => {
    const price = Number.parseFloat(data.price);
    const duration = Number.parseFloat(data.duration);

    const selectedFeatures = availableFeatures.reduce((acc, feature) => {
      acc[feature] = data.features?.[feature] || false;
      return acc;
    }, {} as Record<string, boolean>);

    const subscriptionData = {
      name: data.name,
      price,
      duration,
      features: selectedFeatures,
      ...(mode === "edit" && { status: data.status }),
    };

    if (mode === "edit" && plan) {
      updateMutation.mutate({ id: plan.id, ...subscriptionData });
    } else {
      createMutation.mutate(subscriptionData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Premium Plan"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            {...register("price")}
            type="number"
            step="0.01"
            placeholder="99.99"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            {...register("duration")}
            type="number"
            placeholder="30"
            required
          />
        </div>
      </div>

      {mode === "edit" && (
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                value="active"
                {...register("status")}
                checked={watchedStatus === "active"}
              />{" "}
              Active
            </label>
            <label>
              <input
                type="radio"
                value="inactive"
                {...register("status")}
                checked={watchedStatus === "inactive"}
              />{" "}
              Inactive
            </label>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label>Features</Label>
        <div className="grid grid-cols-2 gap-4">
          {availableFeatures.map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Checkbox
                id={feature}
                {...register(`features.${feature}`)}
                checked={watchedFeatures[feature]}
                onCheckedChange={(checked) =>
                  setValue(`features.${feature}`, checked === true)
                }
              />
              <Label htmlFor={feature} className="font-normal">
                {feature.replace(/([A-Z])/g, " $1").trim()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-400"
      >
        {isPending
          ? mode === "create"
            ? "Creating..."
            : "Updating..."
          : mode === "create"
          ? "Create Plan"
          : "Update Plan"}
      </Button>
    </form>
  );
}

export default SubscriptionForm;
