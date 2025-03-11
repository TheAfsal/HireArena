"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { fetchCategoryType } from "@/app/api/skills";
import { CategoryType } from "@/app/admin/manage/components/category-type";

function Filters({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    category: "",
    level: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    onApplyFilters(selectedFilters);
  };

  useEffect(() => {
    const getCategoryType = async () => {
      try {
        const response = await fetchCategoryType();
        console.log(response);
        
        setCategories(response);
      } catch (err) {
        //@ts-ignore
        console.log(err.message);
      }
    };

    getCategoryType();
  }, []);

  return (
    <div className="w-64 space-y-6">
      <FilterSection title="Type of Employment">
        <select
          name="type"
          onChange={handleFilterChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-Time</option>
          <option value="remote">Remote</option>
        </select>
      </FilterSection>

      <FilterSection title="Categories">
        <select
          name="category"
          onChange={handleFilterChange}
          className="w-full border rounded-md p-2"
        >
          {categories.map((c) => (
            <option value={c.name}>{c.name}</option>
          ))}
          {/* <option value="design">Design</option>
          <option value="engineering">Engineering</option>
          <option value="sales">Sales</option> */}
        </select>
      </FilterSection>

      {/* <FilterSection title="Job Level">
        <select
          name="level"
          onChange={handleFilterChange}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
        </select>
      </FilterSection> */}

      <Button onClick={applyFilters} className="bg-blue-500 text-white w-full">
        Apply Filters
      </Button>
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

export default Filters;

// "use client";

// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { ChevronDown } from "lucide-react";

// function Filters() {
//   return (
//     <div className="w-64 space-y-6">
//       <FilterSection title="Type of Employment">
//         <FilterOption label="Full-time" count={3} />
//         <FilterOption label="Part-Time" count={5} />
//         <FilterOption label="Remote" count={2} />
//         <FilterOption label="Internship" count={24} />
//         <FilterOption label="Contract" count={8} />
//       </FilterSection>

//       <FilterSection title="Categories">
//         <FilterOption label="Design" count={24} />
//         <FilterOption label="Sales" count={3} />
//         <FilterOption label="Marketing" count={3} />
//         <FilterOption label="Business" count={3} checked />
//         <FilterOption label="Human Resource" count={6} />
//         <FilterOption label="Finance" count={4} />
//         <FilterOption label="Engineering" count={4} />
//         <FilterOption label="Technology" count={5} checked />
//       </FilterSection>

//       <FilterSection title="Job Level">
//         <FilterOption label="Entry Level" count={67} />
//         <FilterOption label="Mid Level" count={3} />
//         <FilterOption label="Senior Level" count={5} />
//         <FilterOption label="Director" count={12} checked />
//         <FilterOption label="VP or Above" count={8} />
//       </FilterSection>

//     </div>
//   );
// }

// function FilterSection({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h3 className="font-medium">{title}</h3>
//         <Button variant="ghost" size="sm">
//           <ChevronDown className="h-4 w-4" />
//         </Button>
//       </div>
//       <div className="mt-4 space-y-3">{children}</div>
//     </div>
//   );
// }

// function FilterOption({
//   label,
//   count,
//   checked = false,
// }: {
//   label: string;
//   count: number;
//   checked?: boolean;
// }) {
//   return (
//     <div className="flex items-center gap-2">
//       <Checkbox checked={checked} />
//       <label className="flex flex-1 items-center justify-between text-sm">
//         <span>{label}</span>
//         <span className="text-gray-500">({count})</span>
//       </label>
//     </div>
//   );
// }

// export default Filters;
