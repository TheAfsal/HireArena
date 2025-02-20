import React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Job } from "../app/dashboard/components/types/job";

const jobs: Job[] = [
  {
    id: "1",
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for Email Marketing to help team ma...",
    type: "Full Time",
    categories: ["Marketing", "Design"],
  },
  {
    id: "2",
    title: "Brand Designer",
    company: "Dropbox",
    location: "San Francisco, US",
    description: "Dropbox is looking for Brand Designer to help team t...",
    type: "Full Time",
    categories: ["Design", "Business"],
  },
  {
    id: "3",
    title: "Email Marketing",
    company: "Pitch",
    location: "Berlin, Germany",
    description: "Pitch is looking for Customer Manager to join marketing t...",
    type: "Full Time",
    categories: ["Marketing"],
  },
  {
    id: "4",
    title: "Visual Designer",
    company: "Blinklist",
    location: "Granada, Spain",
    description:
      "Blinklist is looking for Visual Designer to help team desi...",
    type: "Full Time",
    categories: ["Design"],
  },
  {
    id: "5",
    title: "Product Designer",
    company: "ClassPass",
    location: "Manchester, UK",
    description: "ClassPass is looking for Product Designer to help us...",
    type: "Full Time",
    categories: ["Marketing", "Design"],
  },
  {
    id: "6",
    title: "Lead Designer",
    company: "Canva",
    location: "Ontario, Canada",
    description: "Canva is looking for Lead Engineer to help develop n...",
    type: "Full Time",
    categories: ["Design", "Business"],
  },
  {
    id: "7",
    title: "Brand Strategist",
    company: "GoDaddy",
    location: "Marseille, France",
    description: "GoDaddy is looking for Brand Strategist to join the team...",
    type: "Full Time",
    categories: ["Marketing"],
  },
  {
    id: "8",
    title: "Data Analyst",
    company: "Twitter",
    location: "San Diego, US",
    description: "Twitter is looking for Data Analyst to help team desi...",
    type: "Full Time",
    categories: ["Technology"],
  },
];

const categoryColors: Record<string, string> = {
  Marketing: "bg-orange-100 text-orange-800",
  Design: "bg-green-100 text-green-800",
  Business: "bg-blue-100 text-blue-800",
  Technology: "bg-red-100 text-red-800",
};

function FeaturedJobs() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Featured
          <span className="text-blue-600"> jobs</span>
        </h2>
        <Link
          href="/jobs"
          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Show all jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="group transition-colors">
            <CardContent className="p-6 bg-[#F8F8FF] rounded-sm text-gray-600">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold">
                  {/* {job.logo} */}
                </div>
                <Badge
                  variant="normal"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {job.type}
                </Badge>
              </div>

              <h3 className="font-semibold text-lg mb-2 text-text-header">
                {job.title}
              </h3>
              <p className="text-sm mb-2 text-text-sub-content">
                {job.company}·{job.location}
              </p>
              <p className="text-sm mb-4 text-text-content">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.categories?.map((category) => (
                  <span
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${categoryColors[category]}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default FeaturedJobs;
