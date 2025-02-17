import React from "react";
import { Separator } from "@/components/ui/separator";
import JobList from "./components/JobList";

const page = () => {
  return (
    <div className="p-10">
      <div>
        <h2 className="text-3xl font-bold">Find Jobs</h2>
      </div>
      <Separator className="my-5" />
      <div className="py-8 flex gap-8">
        <JobList />
      </div>
    </div>
  );
};

export default page;
