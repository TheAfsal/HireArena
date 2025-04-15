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
import { Category } from "@/app/admin/manage/components/job-category";
import { Skill } from "@/app/admin/manage/page";

const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "REMOTE",
  "INTERNSHIP",
  "CONTRACT",
];

interface Props {
  formData: JobFormData;
  updateFormData: (data: Partial<JobFormData>) => void;
  onNext: () => void;
  jobCategories: Category[];
  skills: Skill[];
}

export default function JobInformation({
  formData,
  updateFormData,
  onNext,
  jobCategories,
  skills,
}: Props) {
  const [newSkill, setNewSkill] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]); // For filtering skills based on user input

  // Add a skill to the requiredSkills list
  const addSkill = (skillName: string, skillId: string) => {
    if (skillName && !formData.requiredSkills.includes(skillId)) {
      updateFormData({
        requiredSkills: [...formData.requiredSkills, skillId],
      });
      setNewSkill(""); // Clear input after adding the skill
      setFilteredSkills([]); // Clear suggestions after adding skill
    }
  };

  // Remove a skill from the requiredSkills list
  const removeSkill = (skillId: string) => {
    updateFormData({
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillId),
    });
  };

  // Filter skills based on user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSkill(value);

    // Filter available skills based on input text
    const filtered = skills.filter((skill) =>
      skill.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSkills(filtered);
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
                <Label htmlFor="jobTitle">Location</Label>
                <p className="text-sm text-gray-500 mt-1">
                  This information will be displayed publicly.
                </p>
              </div>
              <div className="w-full">
                <Input
                  id="jobTitle"
                  placeholder="e.g. Washington DC"
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="flex my-10">
              <div className="w-3/12">
                <Label>Type of Employment</Label>
                <p className="text-sm text-gray-500 mt-1">
                  You can select multiple types of employment
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
                    {jobCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
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
                  placeholder="Search or Add skills"
                  value={newSkill}
                  onChange={handleInputChange} // Handle input change to filter skills
                />
              </div>

              {/* Skill Suggestions */}
              {newSkill && (
                <div className="absolute bg-white shadow-lg rounded mt-10 ml-60 p-2 w-4/12 max-h-60 overflow-auto z-10">
                  {filteredSkills.length > 0 ? (
                    filteredSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="cursor-pointer p-2 hover:bg-gray-100"
                        onClick={() => addSkill(skill.name, skill.id)} // Add skill when clicked
                      >
                        {skill.name}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No suggestions found
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requiredSkills.map((skillId) => {
                  // Find the skill by id
                  const skill = skills.find((s) => s.id === skillId);
                  return (
                    skill && (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  );
                })}
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
