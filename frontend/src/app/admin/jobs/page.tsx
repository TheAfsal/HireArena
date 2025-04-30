"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./compnonets/data-table";
import { fetchAllJobs } from "@/app/api/job";

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  status: string;
  updatedAt: string;
}

const columns = [
  { key: "jobTitle", label: "Title" },
  { key: "jobDescription", label: "Job Description" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Posted" },
  { key: "actions", label: "Actions" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllJobs(page, pageSize, searchTerm);
        setJobs(response.jobs);
        setTotal(response.total);
      } catch (err) {
        console.error("Error fetching jobs:", (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();
  }, [page, pageSize, searchTerm]);

  const handleBlockUnblock = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "Active" ? "Inactive" : "Active" }
          : job
      )
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DataTable
        title="Jobs"
        data={jobs}
        columns={columns}
        searchPlaceholder="Search jobs by title..."
        onBlockUnblock={handleBlockUnblock}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
