"use client";

import type React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import SubscriptionForm from "./subscription-form";
import { SubscriptionPlan } from "../page";

interface SubscriptionDialogProps {
  mode: "create" | "edit";
  plan?: SubscriptionPlan;
  trigger?: React.ReactNode;
}

export function SubscriptionDialog({ mode, plan, trigger }: SubscriptionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-amber-400">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Plan" : "Edit Plan"}</DialogTitle>
        </DialogHeader>
        <SubscriptionForm mode={mode} plan={plan} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}