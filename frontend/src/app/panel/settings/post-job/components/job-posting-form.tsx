"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  FileText,
  Gift,
} from "lucide-react";
import Link from "next/link";
import JobInformation from "./job-information";
import JobDescription from "./job-description";
import PerksAndBenefits from "./perks-and-benefits";
import { Separator } from "@/components/ui/separator";

export interface JobFormData {
  // Step 1: Job Information
  jobTitle: string;
  employmentTypes: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  categories: string[];
  requiredSkills: string[];

  // Step 2: Job Description
  jobDescription: string;
  responsibilities: string;
  qualifications: string;
  niceToHave: string;

  // Step 3: Perks & Benefits
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
}

const INITIAL_FORM_DATA: JobFormData = {
  jobTitle: "",
  employmentTypes: [],
  salaryRange: {
    min: 5000,
    max: 22000,
  },
  categories: [],
  requiredSkills: [],
  jobDescription: "",
  responsibilities: "",
  qualifications: "",
  niceToHave: "",
  benefits: [],
};

export default function JobPostingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const switchState = (state: number) => {
    setCurrentStep(state);
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
  };

  const updateFormData = (data: Partial<JobFormData>) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <div className="container p-8">
      <div className="flex items-center mb-8 gap-2">
        <h1 className="text-2xl font-semibold">Post a Job</h1>
      </div>

      <div className="flex items-center justify-evenly mb-10 border rounded-xl p-3">
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => switchState(1)}
        >
          <div className="bg-blue-500 text-white p-3 rounded-full">
            <Briefcase />
          </div>
          <div
            className={` ${
              currentStep === 1 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="text-blue-500 text-xs text-primary-foreground">
              Step 1/3
            </div>
            <span className="font-semibold">Job Information</span>
          </div>
        </div>
        <Separator orientation="vertical" className="h-7" />
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => switchState(2)}
        >
          <div
            className={`${
              currentStep > 1 ? "bg-blue-500" : "bg-gray-500"
            } text-white p-3 rounded-full`}
          >
            <FileText />
          </div>
          <div
            className={` ${
              currentStep === 1 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="text-blue-500 text-xs text-primary-foreground">
              Step 2/3
            </div>
            <span className="font-semibold">Job Description</span>
          </div>
        </div>
        <Separator orientation="vertical" className="h-7" />
        <div
          className="flex gap-3 it ems-center cursor-pointer"
          onClick={() => switchState(3)}
        >
          <div
            className={`${
              currentStep > 2 ? "bg-blue-500" : "bg-gray-500"
            } text-white p-3 rounded-full`}
          >
            <Gift />
          </div>
          <div
            className={` ${
              currentStep === 1 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="text-blue-500 text-xs text-primary-foreground">
              Step 3/3
            </div>
            <span className="font-semibold">Perks & Benefit</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <JobInformation
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <JobDescription
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
        />
      )}
      {currentStep === 3 && (
        <PerksAndBenefits
          formData={formData}
          updateFormData={updateFormData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
