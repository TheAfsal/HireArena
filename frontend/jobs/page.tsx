"use client";

import React, { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import JobList from "./components/JobList";
import { Separator } from "@/components/ui/separator";
import { fetchFilteredJobs } from "@/app/api/job";
import SearchBar from "./components/SearchBar";

const Page = () => {
  const [filters, setFilters] = useState();

  const handleApplyFilters = (selectedFilters: any) => {
    setFilters(selectedFilters);
  };

  return (
    <div className="p-10">
      <div>
        <h2 className="text-3xl font-bold">Find Jobs</h2>
      </div>
      <Separator className="my-5" />
      <SearchBar />
      <div className="py-8 flex gap-8">
        <Filters onApplyFilters={handleApplyFilters} />
        <JobList filters={filters} />
      </div>
    </div>
  );
};

export default Page;

// import React from "react";
// import Hero from "./components/Hero";
// import SearchBar from "./components/SearchBar";
// import Filters from "./components/Filters";
// import JobList from "./components/JobList";
// import { Separator } from "@/components/ui/separator";

// const page = () => {
//   return (
//     <div className="p-10">
//       <div>
//         <h2 className="text-3xl font-bold">Find Jobs</h2>
//       </div>
//       <Separator className="my-5" />
// {/* <SearchBar /> */}
//       <div className="py-8 flex gap-8">
//         <Filters />
//         <JobList />
//       </div>
//     </div>
//   );
// };

// export default page;
