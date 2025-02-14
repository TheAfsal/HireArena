"use client";

import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchMyApplications } from "@/app/api/job";
import JobCard from "./JobCard";

export interface MyApplications {
  appliedAt: string;
  companyId: string;
  companyLogo: string;
  companyName: string;
  id: string;
  jobId: string;
  jobTitle: string;
  status: boolean;
}

function JobList() {
  const [jobs, setJobs] = useState<MyApplications[]>([]);

  useEffect(() => {
    const getMyApplications = async () => {
      try {
        const response = await fetchMyApplications();
        console.log(response.data);

        setJobs(response.data);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getMyApplications();
  }, []);

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">All Jobs</h2>
          <p className="text-sm text-gray-500">Showing 73 results</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="rounded-md border-gray-300 text-sm">
              <option>Most relevant</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobList;
