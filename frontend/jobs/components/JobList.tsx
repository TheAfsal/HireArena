"use client";

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { fetchFilteredJobs } from "@/app/api/job";

export interface JobsList {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  category: string;
  level: string;
  tags: string[];
  applied: number;
  capacity: number;
  jobDescription: string;
  requiredSkills: { name: string; id: string }[];
  companyLogo: string;
  companyName: string;
  companyLocation?: string;
  companyId?: string;
  isApplied: boolean;  
}

function JobList({ filters }: { filters: any }) {
  const [jobs, setJobs] = useState<JobsList[]>([]);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await fetchFilteredJobs(filters);
      console.log(response);
      setJobs(response);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    console.log(jobs);
    jobs.forEach((job) => console.log(job));
  }, [jobs]);

  if(!jobs.length ) 
    return <p>No jobs found.</p>;

  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold">All Jobs</h2>
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
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
