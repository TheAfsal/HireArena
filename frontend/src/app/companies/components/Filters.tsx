"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface FilterOption {
  label: string;
  count: number;
}

 function Filters() {
  const industries: FilterOption[] = [
    { label: "Advertising", count: 43 },
    { label: "Business Service", count: 4 },
    { label: "Blockchain", count: 8 },
    { label: "Cloud", count: 15 },
    { label: "Consumer Tech", count: 8 },
    { label: "Education", count: 25 },
    { label: "Energy", count: 45 },
    { label: "Gaming", count: 22 },
    { label: "Food & Beverage", count: 5 },
    { label: "Healthcare", count: 7 },
    { label: "Hosting", count: 5 },
    { label: "Media", count: 4 },
  ];

  const companySizes: FilterOption[] = [
    { label: "1-50", count: 25 },
    { label: "51-150", count: 37 },
    { label: "151-250", count: 45 },
    { label: "251-500", count: 5 },
    { label: "501-1000", count: 43 },
    { label: "1000+ above", count: 21 },
  ];

  return (
    <div className="w-64 space-y-8">
      <div>
        <h3 className="font-medium mb-4">Industry</h3>
        <div className="space-y-3">
          {industries.map((option) => (
            <FilterCheckbox key={option.label} {...option} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Company Size</h3>
        <div className="space-y-3">
          {companySizes.map((option) => (
            <FilterCheckbox key={option.label} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterCheckbox({ label, count }: FilterOption) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={label} />
      <label
        htmlFor={label}
        className="flex flex-1 items-center justify-between text-sm"
      >
        <span>{label}</span>
        <span className="text-gray-500">({count})</span>
      </label>
    </div>
  );
}

export default Filters;