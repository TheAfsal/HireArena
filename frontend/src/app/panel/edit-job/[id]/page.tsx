"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { fetchJobById, updateJob } from "@/app/api/job";
import { toast } from "sonner";
import {
  fetchJobCategory,
  fetchSkills,
} from "@/app/api/skills";
import { Skill } from "@/app/admin/manage/page";
import { Category } from "@/app/admin/manage/components/job-category";
import JobInformation from "../../post-job/components/job-information";
import JobDescription from "../../post-job/components/job-description";
import PerksAndBenefits from "../../post-job/components/perks-and-benefits";

export interface JobFormData {
  jobTitle: string;
  employmentTypes: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  categories: string[];
  requiredSkills: string[];
  location: string;
  jobDescription: string;
  responsibilities: string;
  qualifications: string;
  niceToHave: string;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  selectedTests: string[];
}

const INITIAL_FORM_DATA: JobFormData = {
  jobTitle: "",
  employmentTypes: [],
  salaryRange: {
    min: 5000,
    max: 22000,
  },
  location: "",
  categories: [],
  requiredSkills: [],
  jobDescription: "",
  responsibilities: "",
  qualifications: "",
  niceToHave: "",
  benefits: [],
  selectedTests: [],
};

export default function JobEditForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<JobFormData>(INITIAL_FORM_DATA);
  const [jobCategories, setJobCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  // Fetch job data, categories, and skills on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch job by ID
        const job = await fetchJobById(jobId);
        setFormData({
          jobTitle: job.jobTitle || "",
          employmentTypes: job.employmentTypes?.map((et: any) => et.type) || [],
          salaryRange: {
              //@ts-ignore
            min: job.salaryMin || 5000,
            //@ts-ignore
            max: job.salaryMax || 22000,
          },
          location: job.location || "",
          categories: job.categories?.map((cat: any) => cat.id) || [],
          requiredSkills: job.requiredSkills?.map((skill: any) => skill.id) || [],
          jobDescription: job.jobDescription || "",
          responsibilities: job.responsibilities || "",
          qualifications: job.qualifications || "",
          niceToHave: job.niceToHave || "",
          benefits: job.benefits || [],
          //@ts-ignore
          selectedTests: Object.entries(job.testOptions || {})
            .filter(([_, value]) => value)
            .map(([key]) => key) || [],
        });

        // Fetch job categories
        const categories = await fetchJobCategory();
        setJobCategories(categories);

        // Fetch skills
        const skillsData = await fetchSkills();
        setSkills(skillsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load job data.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const switchState = (state: number) => {
    setCurrentStep(state);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Validation
    if (!formData.jobTitle.trim()) {
      toast.error("Job title is required");
      setLoading(false);
      return;
    }
    if (!formData.employmentTypes.length) {
      toast.error("At least one employment type is required");
      setLoading(false);
      return;
    }
    if (!formData.salaryRange.min || formData.salaryRange.min < 0) {
      toast.error("Minimum salary must be a positive number");
      setLoading(false);
      return;
    }
    if (
      !formData.salaryRange.max ||
      formData.salaryRange.max < formData.salaryRange.min
    ) {
      toast.error("Maximum salary must be greater than minimum salary");
      setLoading(false);
      return;
    }
    if (!formData.categories.length) {
      toast.error("At least one category is required");
      setLoading(false);
      return;
    }
    if (!formData.requiredSkills.length) {
      toast.error("At least one required skill is needed");
      setLoading(false);
      return;
    }
    if (!formData.jobDescription.trim()) {
      toast.error("Job description is required");
      setLoading(false);
      return;
    }
    if (!formData.responsibilities.trim()) {
      toast.error("Responsibilities field is required");
      setLoading(false);
      return;
    }

    // Transform formData to server format
    const serverData = {
      jobTitle: formData.jobTitle,
      salaryMin: formData.salaryRange.min,
      salaryMax: formData.salaryRange.max,
      location: formData.location,
      jobDescription: formData.jobDescription,
      responsibilities: formData.responsibilities,
      qualifications: formData.qualifications,
      niceToHave: formData.niceToHave,
      benefits: formData.benefits,
      employmentTypes: formData.employmentTypes.map((type) => ({ type })),
      categories: formData.categories.map((id) => ({ id })),
      requiredSkills: formData.requiredSkills.map((id) => ({ id })),
      testOptions: {
        "Machine Task": formData.selectedTests.includes("Machine Task"),
        "Aptitude Test": formData.selectedTests.includes("Aptitude Test"),
        "Coding Challenge": formData.selectedTests.includes("Coding Challenge"),
        "Technical Interview": formData.selectedTests.includes("Technical Interview"),
        "Behavioral Interview": formData.selectedTests.includes("Behavioral Interview"),
      },
    };

    console.log("Form submitted with data:", serverData);

    try {
      //@ts-ignore
      await updateJob(jobId, serverData);
      router.push("/panel/jobs-list");
      toast.success("Job updated successfully!");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
      setLoading(false);
    }
  };

  const updateFormData = (data: Partial<JobFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container p-8">
      <div className="flex items-center mb-8 gap-2">
        <Link href="/panel/jobs-list" className="flex items-center text-blue-500 hover:underline">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Jobs
        </Link>
        <h1 className="text-2xl font-semibold">Edit Job</h1>
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
              currentStep === 2 ? "text-primary" : "text-muted-foreground"
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
          className="flex gap-3 items-center cursor-pointer"
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
              currentStep === 3 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="text-blue-500 text-xs text-primary-foreground">
              Step 3/3
            </div>
            <span className="font-semibold">Perks & Benefits</span>
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <JobInformation
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          jobCategories={jobCategories}
          skills={skills}
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