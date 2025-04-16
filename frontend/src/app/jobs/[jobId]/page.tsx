"use client";

import { useParams, useRouter } from "next/navigation";
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
  LocateIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import MainContent from "./components/mainContent";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export interface JobDetails {
  id: string;
  jobTitle: string;
  salaryMin: number;
  salaryMax: number;
  jobDescription: string;
  responsibilities: string;
  location: string;
  qualifications: string;
  niceToHave: string;
  benefits: Array<{ title: string }>;
  companyName: string;
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
  const { jobId } = useParams<{ jobId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: jobDetails,
    error,
    isLoading,
  } = useQuery<JobDetails>({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
    enabled: !!jobId,
  });

  const { data: statusDetails } = useQuery({
    queryKey: ["jobStatus"],
    queryFn: () => fetchAppliedJobStatus(jobId as string),
  });

  const handleJobApply = async () => {
    try {
      const response = await applyJob(jobId as string);

      console.log(response);

      if (response.interviewId) {
        router.push(`/job-seeker/aptitude/${response.interviewId}`);
        return;
      }

      toast({
        variant: "default",
        title: "Application Submitted",
        description: `You have successfully applied to ${
          jobDetails?.jobTitle || "this job"
        }`,
      });

      await queryClient.invalidateQueries({
        queryKey: ["jobDetails", jobId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobStatus"],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Application Error",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jobDetails && error) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-red-500">{"Job not found"}</p>
      </div>
    );
  }

  const formatSalary = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  console.log("@ statusDetails", statusDetails);
  console.log("@ {auth.role}", auth.role);

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
            {statusDetails?.status !== false ? (
              <>
                <Button disabled>Applied</Button>
                <div className="flex flex-wrap gap-2">
                  {statusDetails?.status === "scheduled" ? (
                    <Button
                      onClick={() =>
                        router.push(`/job-seeker/machine-task/${jobId}`)
                      }
                    >
                      Next Test Assigned ( Appear for Machine Task )
                    </Button>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={getBadgeClass(statusDetails?.status)}
                    >
                      {statusDetails?.state[
                        statusDetails?.state.length - 1
                      ]?.status?.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </>
            ) : (
              statusDetails?.message !== "not a job-seeker" && (
                <Button onClick={handleJobApply}>Apply Now</Button>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
                {formatSalary(jobDetails!.salaryMin, jobDetails!.salaryMax)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocateIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{jobDetails!.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Posted On</p>
              <p className="font-medium">
                {new Date(jobDetails!.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {jobDetails && <MainContent jobDetails={jobDetails} />}
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
