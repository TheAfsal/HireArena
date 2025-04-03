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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define validation schema using zod
const subscriptionSchema = z.object({
  name: z
    .string()
    .min(3, "Plan name must be at least 3 characters")
    .max(50, "Plan name must not exceed 50 characters"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Price must be a valid number")
    .refine((val) => Number(val) > 0, "Price must be greater than 0")
    .refine((val) => Number(val) <= 10000, "Price must not exceed $10,000"),
  duration: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Duration must be a valid number")
    .refine((val) => Number(val) > 0, "Duration must be greater than 0")
    .refine((val) => Number(val) <= 365, "Duration must not exceed 365 days"),
  features: z.record(z.string(), z.boolean()).refine(
    (features) => Object.values(features).some((enabled) => enabled),
    "At least one feature must be selected"
  ),
  status: z.enum(["active", "inactive"]).optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// Update SubscriptionPlan type to match expected status values
export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string; // Keep as string since the form handles it as a string input
  duration: string; // Keep as string since the form handles it as a string input
  features: Record<string, boolean>;
  status: "active" | "inactive"; // Updated to specific union type
};

export type CreateSubscriptionData = Omit<SubscriptionPlan, "id">;

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
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      price: "",
      duration: "",
      features: availableFeatures.reduce((acc, feature) => {
        acc[feature] = false;
        return acc;
      }, {} as Record<string, boolean>),
      status: mode === "edit" ? "active" : undefined,
    },
  });

  const watchedFeatures = watch("features", {});
  const watchedStatus = watch("status");

  useEffect(() => {
    if (mode === "edit" && plan) {
      setValue("name", plan.name);
      setValue("price", plan.price);
      setValue("duration", plan.duration);
      setValue("status", plan.status); // Now type-safe with "active" | "inactive"
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

  const onSubmit = async (data: SubscriptionFormData) => {
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
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            {...register("price")}
            type="number"
            step="0.01"
            placeholder="99.99"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days)</Label>
          <Input
            id="duration"
            {...register("duration")}
            type="number"
            placeholder="30"
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {mode === "edit" && (
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="active"
                {...register("status")}
                checked={watchedStatus === "active"}
              />
              <span>Active</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="inactive"
                {...register("status")}
                checked={watchedStatus === "inactive"}
              />
              <span>Inactive</span>
            </label>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm">{errors.status.message}</p>
          )}
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
        {errors.features && (
          // @ts-ignore
          <p className="text-red-500 text-sm">{errors.features.message}</p>
        )}
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

// "use client";

// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { createSubscription, updateSubscription } from "@/app/api/subscription";
// import { useEffect } from "react";
// import {
//   CreateSubscriptionData,
//   SubscriptionPlan,
// } from "../page";

// const availableFeatures = [
//   "featuredProfile",
//   "resumeReview",
//   "premiumAlerts",
//   "unlimitedApplications",
//   "interviewMaterial",
//   "skillAssessments",
//   "careerCoaching",
//   "networkingEvents",
// ];
// interface SubscriptionFormProps {
//   mode: "create" | "edit";
//   plan?: SubscriptionPlan;
//   onSuccess?: () => void;
// }

// function SubscriptionForm({ mode, plan, onSuccess }: SubscriptionFormProps) {
  
//   const { register, handleSubmit, reset, setValue, watch } =
//   useForm<CreateSubscriptionData>({
//     defaultValues: {
//       features: availableFeatures.reduce((acc, feature) => {
//         acc[feature] = false;
//         return acc;
//       }, {} as Record<string, boolean>),
//       status: mode === "edit" ? "active" : undefined,
//     },
//   });
  
//   const queryClient = useQueryClient();
//   const watchedFeatures = watch("features", {});
//   const watchedStatus = watch("status");

//   useEffect(() => {
//     if (mode === "edit" && plan) {
//       setValue("name", plan.name);
//       setValue("price", plan.price);
//       setValue("duration", plan.duration);
//       setValue("status", plan.status);

//       Object.entries(plan.features).forEach(([feature, enabled]) => {
//         setValue(`features.${feature}`, enabled);
//       });
//     }
//   }, [mode, plan, setValue]);

//   const createMutation = useMutation({
//     mutationFn: createSubscription,
//     onSuccess: () => {
//       toast.success("Subscription plan created successfully!");
//       reset();
//       queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
//       onSuccess?.();
//     },
//     onError: () => {
//       toast.error("Failed to create subscription plan");
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: updateSubscription,
//     onSuccess: () => {
//       toast.success("Subscription plan updated successfully!");
//       queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
//       onSuccess?.();
//     },
//     onError: () => {
//       toast.error("Failed to update subscription plan");
//     },
//   });

//   const onSubmit = async (data: CreateSubscriptionData) => {
//     const price = Number.parseFloat(data.price);
//     const duration = Number.parseFloat(data.duration);

//     const selectedFeatures = availableFeatures.reduce((acc, feature) => {
//       acc[feature] = data.features?.[feature] || false;
//       return acc;
//     }, {} as Record<string, boolean>);

//     const subscriptionData = {
//       name: data.name,
//       price,
//       duration,
//       features: selectedFeatures,
//       ...(mode === "edit" && { status: data.status }),
//     };

//     if (mode === "edit" && plan) {
//       updateMutation.mutate({ id: plan.id, ...subscriptionData });
//     } else {
//       createMutation.mutate(subscriptionData);
//     }
//   };

//   const isPending = createMutation.isPending || updateMutation.isPending;

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="name">Plan Name</Label>
//           <Input
//             id="name"
//             {...register("name")}
//             placeholder="Premium Plan"
//             required
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="price">Price (USD)</Label>
//           <Input
//             id="price"
//             {...register("price")}
//             type="number"
//             step="0.01"
//             placeholder="99.99"
//             required
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="duration">Duration (days)</Label>
//           <Input
//             id="duration"
//             {...register("duration")}
//             type="number"
//             placeholder="30"
//             required
//           />
//         </div>
//       </div>

//       {mode === "edit" && (
//         <div className="space-y-4">
//           <Label>Status</Label>
//           <div className="space-x-4">
//             <label>
//               <input
//                 type="radio"
//                 value="active"
//                 {...register("status")}
//                 checked={watchedStatus === "active"}
//               />{" "}
//               Active
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 value="inactive"
//                 {...register("status")}
//                 checked={watchedStatus === "inactive"}
//               />{" "}
//               Inactive
//             </label>
//           </div>
//         </div>
//       )}

//       <div className="space-y-4">
//         <Label>Features</Label>
//         <div className="grid grid-cols-2 gap-4">
//           {availableFeatures.map((feature) => (
//             <div key={feature} className="flex items-center space-x-2">
//               <Checkbox
//                 id={feature}
//                 {...register(`features.${feature}`)}
//                 checked={watchedFeatures[feature]}
//                 onCheckedChange={(checked) =>
//                   setValue(`features.${feature}`, checked === true)
//                 }
//               />
//               <Label htmlFor={feature} className="font-normal">
//                 {feature.replace(/([A-Z])/g, " $1").trim()}
//               </Label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Button
//         type="submit"
//         disabled={isPending}
//         className="w-full bg-amber-400"
//       >
//         {isPending
//           ? mode === "create"
//             ? "Creating..."
//             : "Updating..."
//           : mode === "create"
//           ? "Create Plan"
//           : "Update Plan"}
//       </Button>
//     </form>
//   );
// }

// export default SubscriptionForm;
