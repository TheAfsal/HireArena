import React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Job } from "../app/dashboard/components/types/job";

//   id: string;
//   title: string;
//   company: string;
//   location: string;
//   description?: string;
//   type?: "Full Time" | "Part Time" | "Contract";
//   categories?: string[];
//   tags?: {
//     type: string
//     categories: string[]
//   }

const jobs: Job[] = [
  {
    id: "1",
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "2",
    title: "Social Media Assistant",
    company: "Netifly",
    location: "Paris, France",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "3",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, USA",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "4",
    title: "Brand Designer",
    company: "Maze",
    location: "San Francisco, USA",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "5",
    title: "Interactive Developer",
    company: "Terraform",
    location: "Hamburg, Germany",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "6",
    title: "Interactive Developer",
    company: "Udacity",
    location: "Hamburg, Germany",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "7",
    title: "HR Manager",
    company: "Packer",
    location: "Lucern, Switzerland",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
  {
    id: "8",
    title: "HR Manager",
    company: "Webflow",
    location: "Lucern, Switzerland",
    tags: {
      type: "Full-Time",
      categories: ["Marketing", "Design"],
    },
  },
];

function LatestJobs() {
  return (
    <section className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Latest <span className="text-blue-600">jobs open</span>
          </h2>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Show all jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-white p-6 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* <Image
                //   src={job.logo}
                  alt={`${job.company} logo`}
                  width={40}
                  height={40}
                  className="rounded"
                /> */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {job.company} ·{job.location}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                      {job.tags?.type}
                    </Badge>
                    {job.tags?.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className={
                          category === "Marketing"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestJobs;
