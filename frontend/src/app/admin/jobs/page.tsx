"use client";
import { useEffect, useState } from "react";
import { DataTable } from "../components/data-table";
import { fetchAllJobs } from "@/app/api/job";

// const jobs = [
//   {
//     title: "Product Designer",
//     location: "San Francisco",
//     team: "Design",
//     status: "Active",
//     posted: "2 days ago",
//     applicants: "12",
//   },
//   {
//     title: "Product Manager",
//     location: "Remote",
//     team: "Product",
//     status: "Draft",
//     posted: "3 days ago",
//     applicants: "5",
//   },
//   {
//     title: "Software Engineer",
//     location: "New York",
//     team: "Engineering",
//     status: "Active",
//     posted: "5 days ago",
//     applicants: "7",
//   },
//   {
//     title: "Sales Representative",
//     location: "Chicago",
//     team: "Sales",
//     status: "Draft",
//     posted: "1 week ago",
//     applicants: "3",
//   },
//   {
//     title: "Marketing Specialist",
//     location: "Los Angeles",
//     team: "Marketing",
//     status: "Active",
//     posted: "2 weeks ago",
//     applicants: "8",
//   },
//   {
//     title: "Customer Success Manager",
//     location: "Austin",
//     team: "Customer Success",
//     status: "Active",
//     posted: "1 month ago",
//     applicants: "4",
//   },
//   {
//     title: "Data Analyst",
//     location: "Boston",
//     team: "Analytics",
//     status: "Draft",
//     posted: "2 months ago",
//     applicants: "6",
//   },
//   {
//     title: "Operations Associate",
//     location: "Denver",
//     team: "Operations",
//     status: "Active",
//     posted: "3 months ago",
//     applicants: "9",
//   },
//   {
//     title: "UX Researcher",
//     location: "Seattle",
//     team: "Research",
//     status: "Draft",
//     posted: "4 months ago",
//     applicants: "2",
//   },
//   {
//     title: "Business Development Representative",
//     location: "Houston",
//     team: "Business Development",
//     status: "Active",
//     posted: "5 months ago",
//     applicants: "11",
//   },
// ]

const columns = [
  { key: "jobTitle", label: "Title" },
  { key: "jobDescription", label: "Job Description" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Posted" },
  { key: "actions", label: "Actions" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

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
  return (
    <DataTable
      title="Jobs"
      columns={columns}
      data={jobs}
      searchPlaceholder="Search jobs"
    />
  );
}
