"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  applyJob,
  fetchAppliedJobStatus,
  fetchJobDetails,
} from "@/app/api/job";
import {
  MapPin,
  Share2,
  BriefcaseIcon,
  DollarSign,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";

interface JobDetails {
  id: string;
  jobTitle: string;
  salaryMin: number;
  salaryMax: number;
  jobDescription: string;
  responsibilities: string;
  qualifications: string;
  niceToHave: string;
  benefits: Array<{ title: string }>;
  companyName: string;
  // location?: string;
  logo?: string;
  employmentTypes: Array<{ type: string }>;
  categories: Array<{ name: string }>;
  requiredSkills: Array<{ name: string }>;
  createdAt: string;
  isApplied: boolean;
  testOptions: {
    "Aptitude Test": boolean;
    "Behavioral Interview": boolean;
    "Coding Challenge": boolean;
    "Machine Task": boolean;
    "Technical Interview": boolean;
  };
}

function Page() {
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetchJobDetails(params.jobId as string);
        console.log(response);

        setJobDetails(response);
      } catch (error: unknown) {
        // setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params.jobId]);

  const { data: statusDetails } = useQuery({
    queryKey: ["jobStatus"],
    queryFn: () => fetchAppliedJobStatus(params.jobId as string),
  });

  const handleJobApply = async () => {
    let response = await applyJob(params.jobId as string);
    console.log(response);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-red-500">{"Job not found"}</p>
      </div>
    );
  }

  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:px-6 lg:py-12">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border p-10">
          <div className="flex items-center gap-4 ">
            <div className="">
              <Avatar className="h-20 w-20">
                <AvatarImage src={jobDetails?.logo} />
                <AvatarFallback>{jobDetails?.companyName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{jobDetails?.jobTitle}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{jobDetails?.companyName}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {/* <span>{jobDetails.location}</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                if (navigator.share) {
                  await navigator.share({
                    title: "jobTitle",
                    text: `Check out this job: ${"jobTitle"}`,
                    url: "jobLink",
                  });
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {jobDetails?.isApplied ? (
              <>
                <Button disabled>Applied</Button>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={getBadgeClass(statusDetails?.status)}
                  >
                    {statusDetails?.status}
                  </Badge>
                </div>
              </>
            ) : (
              <Button onClick={handleJobApply}>Apply Now</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Job Type</p>
              <p className="font-medium">
                {jobDetails?.employmentTypes
                  ?.map((typeItem) => typeItem.type.replace("_", " "))
                  .reverse()
                  .join(", ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Salary Range</p>
              <p className="font-medium">
                {formatSalary(jobDetails.salaryMin, jobDetails.salaryMax)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Posted On</p>
              <p className="font-medium">
                {new Date(jobDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {jobDetails.jobDescription}
            </p>
          </section>

          <Separator />

          {/* Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {jobDetails.responsibilities}
            </p>
          </section>

          <Separator />

          {/* Qualifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {jobDetails.qualifications}
            </p>
          </section>

          {jobDetails.niceToHave && (
            <>
              <Separator />
              <section>
                <h2 className="text-xl font-semibold mb-4">Nice to Have</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {jobDetails.niceToHave}
                </p>
              </section>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails.categories.map((category) => (
                <Badge key={category.name} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Required Skills */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {jobDetails.requiredSkills.map((skill) => (
                <Badge key={skill.name} variant="outline">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {jobDetails?.benefits.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">Benefits</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {jobDetails.benefits.map((benefit, index) => (
                  <li key={index}>{benefit.title}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Options */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">Test Options</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {jobDetails.testOptions["Aptitude Test"] && (
                <li>Aptitude Test</li>
              )}
              {jobDetails.testOptions["Machine Task"] && <li>Machine Task</li>}
              {jobDetails.testOptions["Coding Challenge"] && (
                <li>Coding Challenge</li>
              )}
              {jobDetails.testOptions["Technical Interview"] && (
                <li>Technical Interview</li>
              )}
              {jobDetails.testOptions["Behavioral Interview"] && (
                <li>Behavioral Interview</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "INTERVIEW":
      return "bg-blue-200 text-blue-800";
    case "HIRED":
      return "bg-green-200 text-green-800";
    case "REJECTED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default Page;
