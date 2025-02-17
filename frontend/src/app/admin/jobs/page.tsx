"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../components/data-table";
import { fetchAllJobs } from "@/app/api/job";

// Columns definition for the jobs table
const columns = [
  { key: "jobTitle", label: "Title" },
  { key: "jobDescription", label: "Job Description" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Posted" },
  { key: "actions", label: "Actions" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  // Fetch all jobs from the API
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetchAllJobs();
        console.log(response);
        setJobs(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getJobs();
  }, []);

  // Function to toggle the job status between "Active" and "Inactive"
  const handleBlockUnblock = (jobTitle: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.jobTitle === jobTitle
          ? { ...job, status: job.status === "Active" ? "Inactive" : "Active" }
          : job
      )
    );
  };

  return (
    <DataTable
      title="Jobs"
      data={jobs}
      columns={columns}
      searchPlaceholder="Search jobs"
      onBlockUnblock={handleBlockUnblock} 
    />
  );
}
