"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Stethoscope, PocketIcon as Pool, Video } from "lucide-react";
import { useState } from "react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { JobFormData } from "./job-posting-form";

interface Props {
  formData: JobFormData;
  updateFormData: (data: Partial<JobFormData>) => void;
  onSubmit: () => void;
}

const BENEFIT_ICONS = {
  healthcare: Stethoscope,
  vacation: Pool,
  development: Video,
};

export default function PerksAndBenefits({
  formData,
  updateFormData,
  onSubmit,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    title: "",
    description: "",
    icon: "healthcare",
  });

  const addBenefit = () => {
    if (newBenefit.title && newBenefit.description) {
      updateFormData({
        benefits: [...formData.benefits, newBenefit],
      });
      setNewBenefit({ title: "", description: "", icon: "healthcare" });
      setShowAddForm(false);
    }
  };

  const removeBenefit = (index: number) => {
    updateFormData({
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            List out your top perks and benefits.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 p-5">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Benefit
          </Button>

          {showAddForm && (
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Benefit Title"
                    value={newBenefit.title}
                    onChange={(e) =>
                      setNewBenefit({ ...newBenefit, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Benefit Description"
                    value={newBenefit.description}
                    onChange={(e) =>
                      setNewBenefit({
                        ...newBenefit,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addBenefit}>Add Benefit</Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {formData.benefits.map((benefit, index) => (
              <Card key={index} className="p-4 relative">
                <button
                  onClick={() => removeBenefit(index)}
                  className="absolute top-2 right-2 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-start gap-4">
                  {BENEFIT_ICONS[
                    benefit.icon as keyof typeof BENEFIT_ICONS
                  ] && (
                    <div className="text-primary">
                      {React.createElement(
                        BENEFIT_ICONS[
                          benefit.icon as keyof typeof BENEFIT_ICONS
                        ],
                        {
                          className: "h-6 w-6",
                        }
                      )}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-5">
        <Button onClick={onSubmit}>Post</Button>
      </div>
    </>
  );
}
