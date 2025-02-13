"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { JobFormData } from "./job-posting-form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/app/admin/manage/components/job-category";
import { Skill } from "@/app/admin/manage/page";

interface Props {
  formData: JobFormData;
  updateFormData: (data: Partial<JobFormData>) => void;
  onNext: () => void;
}

export default function JobDescription({
  formData,
  updateFormData,
  onNext,

}: Props) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>
            Add the description of the job, responsibilities, who you are, and
            nice to haves
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <div className="flex my-10">
            <div className="w-4/12">
              <Label>Job Description</Label>
              <p className="text-sm text-gray-500 mt-1">
                You can select multiple type of employment
              </p>
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Enter job description"
                value={formData.jobDescription}
                onChange={(e) =>
                  updateFormData({ jobDescription: e.target.value })
                }
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum 500 characters
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex my-10">
            <div className="w-4/12">
              <Label>Responsibilities</Label>
              <p className="text-sm text-gray-500 mt-1">
                Outline the core responsibilities of the position.
              </p>
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Enter job responsibilities"
                value={formData.responsibilities}
                onChange={(e) =>
                  updateFormData({ responsibilities: e.target.value })
                }
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum 500 characters
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex my-10">
            <div className="w-4/12">
              <Label>Who You Are</Label>
              <p className="text-sm text-gray-500 mt-1">
                Add your preferred candidates qualifications
              </p>
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Enter qualifications"
                value={formData.qualifications}
                onChange={(e) =>
                  updateFormData({ qualifications: e.target.value })
                }
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum 500 characters
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex my-10">
            <div className="w-4/12">
              <Label>Nice-To-Haves</Label>
              <p className="text-sm text-gray-500 mt-1">
                Add nice-to-have skills and qualifications for the role to
                encourage a more diverse set of candidates to apply
              </p>
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Enter nice to haves"
                value={formData.niceToHave}
                onChange={(e) => updateFormData({ niceToHave: e.target.value })}
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum 500 characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onNext}>Next Step</Button>
      </div>
    </div>
  );
}
