"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

function Filters() {
  return (
    <div className="w-64 space-y-6">
      <FilterSection title="Type of Employment">
        <FilterOption label="Full-time" count={3} />
        <FilterOption label="Part-Time" count={5} />
        <FilterOption label="Remote" count={2} />
        <FilterOption label="Internship" count={24} />
        <FilterOption label="Contract" count={8} />
      </FilterSection>

      <FilterSection title="Categories">
        <FilterOption label="Design" count={24} />
        <FilterOption label="Sales" count={3} />
        <FilterOption label="Marketing" count={3} />
        <FilterOption label="Business" count={3} checked />
        <FilterOption label="Human Resource" count={6} />
        <FilterOption label="Finance" count={4} />
        <FilterOption label="Engineering" count={4} />
        <FilterOption label="Technology" count={5} checked />
      </FilterSection>

      <FilterSection title="Job Level">
        <FilterOption label="Entry Level" count={67} />
        <FilterOption label="Mid Level" count={3} />
        <FilterOption label="Senior Level" count={5} />
        <FilterOption label="Director" count={12} checked />
        <FilterOption label="VP or Above" count={8} />
      </FilterSection>

      <FilterSection title="Salary Range">
        <FilterOption label="€700 - €1000" count={4} />
        <FilterOption label="€1000 - €1500" count={6} />
        <FilterOption label="€1500 - €2000" count={10} />
        <FilterOption label="€3000 or above" count={4} checked />
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Button variant="ghost" size="sm">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function FilterOption({
  label,
  count,
  checked = false,
}: {
  label: string;
  count: number;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} />
      <label className="flex flex-1 items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-gray-500">({count})</span>
      </label>
    </div>
  );
}


export default Filters;