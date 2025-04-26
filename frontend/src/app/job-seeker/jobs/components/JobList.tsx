"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchJobsFiltered } from "@/app/api/job";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function JobList({ filters }: { filters: any }) {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs(1);
  }, [filters]);

  const fetchJobs = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetchJobsFiltered(
        filters,
        page,
        pagination.pageSize
      );
      setJobs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchJobs(newPage);
    }
  };

  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold">All Jobs ({pagination.total})</h2>
      {loading ? (
        <div
          className="flex justify-center items-center py-8"
          aria-live="polite"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading jobs...</span>
        </div>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              disabled={pagination.page === 1 || loading}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              disabled={pagination.page === pagination.totalPages || loading}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default JobList;

// "use client";

// import { Button } from "@/components/ui/button";
// import { LayoutGrid, List } from "lucide-react";
// import JobCard from "./JobCard";
// import { useEffect, useState } from "react";
// import { fetchJobListBrief } from "@/app/api/job";

// export interface JobsList {
//   id: number;
//   title: string;
//   company: string;
//   location: string;
//   type: string;
//   tags: string[];
//   applied: number;
//   capacity: number;
//   jobDescription: string;
//   requiredSkills: [
//     {
//       name: string;
//       id: string;
//     }
//   ];
//   logo: string;
//   companyLogo?: string;
//   companyName: string;
//   companyLocation?: string;
//   companyId?: string;
//   isApplied: boolean;
// }

// function JobList() {
//   const [jobs, setJobs] = useState<JobsList[]>([]);

//   useEffect(() => {
//     const getJobListBrief = async () => {
//       try {
//         const response = await fetchJobListBrief();
//         console.log(response);

//         setJobs(response);
//       } catch (err) {
//         console.log((err as Error).message);
//       }
//     };

//     getJobListBrief();
//   }, []);

//   return (
//     <div className="flex-1">
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h2 className="text-xl font-semibold">All Jobs</h2>
//           <p className="text-sm text-gray-500">Showing 73 results</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-500">Sort by:</span>
//             <select className="rounded-md border-gray-300 text-sm">
//               <option>Most relevant</option>
//               <option>Latest</option>
//               <option>Oldest</option>
//             </select>
//           </div>
//           <div className="flex items-center gap-1 rounded-lg border bg-white p-1">
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//               <LayoutGrid className="h-4 w-4" />
//             </Button>
//             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//               <List className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <div className="space-y-4">
//         {jobs.map((job) => (
//           <JobCard key={job.id} job={job} />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default JobList;
