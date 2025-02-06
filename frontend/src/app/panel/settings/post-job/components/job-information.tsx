"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobFormData } from "./job-posting-form";

const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Remote",
  "Internship",
  "Contract",
];

const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer Support",
];

interface Props {
  formData: JobFormData;
  updateFormData: (data: Partial<JobFormData>) => void;
  onNext: () => void;
}

export default function JobInformation({
  formData,
  updateFormData,
  onNext,
}: Props) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill && !formData.requiredSkills.includes(newSkill)) {
      updateFormData({
        requiredSkills: [...formData.requiredSkills, newSkill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    updateFormData({
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
          This information will be displayed publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          <div className="space-y-6">
            <div className="flex my-10">
              <div className="w-3/12">
                <Label htmlFor="jobTitle">Job Title</Label>
                <p className="text-sm text-gray-500 mt-1">
                  This information will be displayed publicly.
                </p>
              </div>
              <div className="w-full">
                <Input
                  id="jobTitle"
                  placeholder="e.g. Software Engineer"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData({ jobTitle: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  At least 80 characters
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex my-10">
              <div className="w-3/12">
                <Label>Type of Employment</Label>
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple type of employment
                </p>
              </div>
              <div className="grid gap-2 w-full">
                {EMPLOYMENT_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.employmentTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData({
                            employmentTypes: [
                              ...formData.employmentTypes,
                              type,
                            ],
                          });
                        } else {
                          updateFormData({
                            employmentTypes: formData.employmentTypes.filter(
                              (t) => t !== type
                            ),
                          });
                        }
                      }}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex my-10">
              <div className="w-3/12">
                <Label>Salary Range</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Please specify the estimated salary range for the role. *You
                  can leave this blank.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1">
                  <Input
                    type="number"
                    value={formData.salaryRange.min}
                    onChange={(e) =>
                      updateFormData({
                        salaryRange: {
                          ...formData.salaryRange,
                          min: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <span>to</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    value={formData.salaryRange.max}
                    onChange={(e) =>
                      updateFormData({
                        salaryRange: {
                          ...formData.salaryRange,
                          max: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex my-10">
              <div className="w-3/12">
                <Label>Categories</Label>
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple job categories
                </p>
              </div>
              <div className="w-full">
                <Select
                  value={formData.categories[0]}
                  onValueChange={(value) =>
                    updateFormData({ categories: [value] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Job Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="flex my-10">
              <div className="w-3/12">
                <Label>Required Skills</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Add required skills for the job
                </p>
              </div>
              <div className="flex gap-2 mb-2 w-full">
                <Input
                  placeholder="Add required skills"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button onClick={addSkill}>Add Skills</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
      </Card>
      <div className="flex justify-end mt-7">
        <Button onClick={onNext}>Next Step</Button>
      </div>
    </>
  );
}
