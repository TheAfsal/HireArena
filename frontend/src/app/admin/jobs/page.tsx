"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "./components/data-table";
import { fetchAllJobsForAdmin } from "@/app/api/job";

interface Job {
  id: string;
  jobTitle: string;
  jobDescription: string;
  status: string;
  updatedAt: string;
  location?: string;
  department?: string;
}

interface FilterParams {
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  department?: string;
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
  const [filters, setFilters] = useState<FilterParams>({ searchTerm: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllJobsForAdmin({
          page,
          pageSize,
          sortBy: "updatedAt",
          sortOrder: "desc",
          ...filters,
        });
        setJobs(response.jobs);
        setTotal(response.total);
      } catch (err) {
        console.error("Error fetching jobs:", (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    getJobs();
  }, [page, pageSize, filters]);

  const handleBlockUnblock = useCallback((jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: job.status === "Active" ? "Inactive" : "Active" }
          : job
      )
    );
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };
      // Only update if filters have changed to avoid infinite loop
      if (
        prev.searchTerm === updatedFilters.searchTerm &&
        prev.startDate === updatedFilters.startDate &&
        prev.endDate === updatedFilters.endDate &&
        prev.status === updatedFilters.status &&
        prev.department === updatedFilters.department
      ) {
        return prev;
      }
      return updatedFilters;
    });
    setPage(1);
  }, []);

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
        onFilterChange={handleFilterChange}
        isLoading={isLoading}
      />
    </div>
  );
}