"use client";

import { useState } from "react";
import JobList from "./components/JobList";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";

const Page = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const handleApplyFilters = (selectedFilters: any) => {
    setFilters(selectedFilters);
  };

  return (
    <div className="p-10">
      <div>
        <h2 className="text-3xl font-bold">Find Jobs</h2>
      </div>
      <Separator className="my-5" />
      <SearchBar onSearch={(query) => setSearchQuery(query)} />
      <div className="py-8 flex gap-8">
        <Filters onApplyFilters={handleApplyFilters} />
        <JobList filters={{ ...filters, searchQuery }} />
      </div>
    </div>
  );
};

export default Page;

