"use client";

import { useState, useEffect } from "react";
import JobList from "./components/JobList";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";

const Page = () => {
  const [filters, setFilters] = useState({}); // Base filters from Filters component
  const [searchQuery, setSearchQuery] = useState("");
  const [combinedFilters, setCombinedFilters] = useState({}); // Filters + searchQuery

  // Update combinedFilters whenever filters or searchQuery changes
  useEffect(() => {
    setCombinedFilters({ ...filters, searchQuery });
  }, [filters, searchQuery]);

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
        <JobList filters={combinedFilters} />
      </div>
    </div>
  );
};

export default Page;