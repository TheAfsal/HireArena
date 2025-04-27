"use client";
import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  Briefcase,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { fetchPostedJobs } from "@/app/api/job";
import { JobStatus, JobType } from "@/Types/job.types";

export interface IJob {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  experience: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  requirements: string[];
  employmentTypes: {
    type: JobType;
  }[];
  applicationsCount: number;
  status: JobStatus;
  postedAt: Date;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}


const JobsPage: React.FC = () => {
  const router = useRouter();

  const {
    data: jobs,
    isLoading,
    error,
  } = useQuery<IJob[]>({
    queryKey: ["company_jobs"],
    queryFn: fetchPostedJobs,
  });

  const handleViewJobDashboard = (id: string) => {
    router.push(`/panel/list-applications/${id}`);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="text-lg text-red-500">
          Failed to load jobs. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Company Jobs</h1>
          <Button>
            <Briefcase className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <Card
              key={job.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
                  <Badge
                    variant={
                      job.status === JobStatus.Open ? "default" : "secondary"
                    }
                    className="ml-2"
                  >
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    {job.employmentTypes.map((item) => (
                      <span>{item.type}</span>
                    ))}
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    {/* <span>{job.applicationsCount} Applications</span> */}
                    <span>Calculating Applications...</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      Deadline {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewJobDashboard(job.id)}
                >
                  View Dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {jobs?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No jobs posted yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by posting your first job opening
            </p>
            <Button className="mt-4">Post a Job</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;

// const fetchCompanyJobs = (): Promise<IJob[]> => {
//   return Promise.resolve([
//     {
//       _id: "988e84c8-5c06-48d0-9e6b-2b1cc63cdbe6",
//       title: "Senior Frontend Developer",
//       company: "TechCorp Inc.",
//       location: "San Francisco, CA",
//       type: JobType.FullTime,
//       experience: "3-5 years",
//       salary: "$120,000 - $150,000",
//       description:
//         "We are looking for a Senior Frontend Developer to join our team.",
//       requirements: ["React", "TypeScript", "CSS", "HTML"],
//       applicationsCount: 12,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-10"),
//       deadline: new Date("2025-05-10"),
//       createdAt: new Date("2025-04-10"),
//       updatedAt: new Date("2025-04-10"),
//     },
//     {
//       _id: "d98881c3-bab3-4c01-9d5a-6fb285f66154",
//       title: "Backend Engineer",
//       company: "TechCorp Inc.",
//       location: "Remote",
//       type: JobType.Remote,
//       experience: "2-4 years",
//       salary: "$100,000 - $130,000",
//       description: "We are looking for a Backend Engineer to join our team.",
//       requirements: ["Node.js", "Express", "MongoDB", "AWS"],
//       applicationsCount: 8,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-15"),
//       deadline: new Date("2025-05-15"),
//       createdAt: new Date("2025-04-15"),
//       updatedAt: new Date("2025-04-15"),
//     },
//     {
//       _id: "2d19a497-041d-42b4-901e-fe190dfede71",
//       title: "UI/UX Designer",
//       company: "TechCorp Inc.",
//       location: "New York, NY",
//       type: JobType.FullTime,
//       experience: "2+ years",
//       salary: "$90,000 - $120,000",
//       description: "We are looking for a UI/UX Designer to join our team.",
//       requirements: ["Figma", "Adobe XD", "Sketch", "User Research"],
//       applicationsCount: 5,
//       status: JobStatus.Open,
//       postedAt: new Date("2025-04-18"),
//       deadline: new Date("2025-05-18"),
//       createdAt: new Date("2025-04-18"),
//       updatedAt: new Date("2025-04-18"),
//     },
//   ]);
// };
