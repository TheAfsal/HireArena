"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { fetchJobCategory } from "@/app/api/skills";
import { CategoryType } from "@/app/admin/manage/components/category-type";
import { Input } from "@/components/ui/input";

function Filters({
  onApplyFilters,
}: {
  onApplyFilters: (filters: any) => void;
}) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    category: "",
    location: "",
    level: "",
    skill: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    onApplyFilters(selectedFilters);
  };

  const removeFilter = () => {
    const resetFilters = {
      type: "",
      category: "",
      location: "",
      level: "",
      skill: "",
    };
    setSelectedFilters(resetFilters); 
    onApplyFilters(resetFilters);     
  };

  useEffect(() => {
    const getCategoryType = async () => {
      try {
        const response = await fetchJobCategory();
        setCategories(response);
      } catch (err) {
        console.error((err as Error).message);
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
          value={selectedFilters.type}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-Time</option>
          <option value="REMOTE">Remote</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
      </FilterSection>

      <FilterSection title="Categories">
        <select
          name="category"
          onChange={handleFilterChange}
          value={selectedFilters.category}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </FilterSection>

      <FilterSection title="Skill">
        <select
          name="skill"
          onChange={handleFilterChange}
          value={selectedFilters.skill}
          className="w-full border rounded-md p-2"
        >
          <option value="">All</option>
          <option value="Adobe">Adobe</option>
          <option value="Figma">Figma</option>
          <option value="React">React</option>
          <option value="Node">NodeJs</option>
        </select>
      </FilterSection>

      <FilterSection title="Location">
        <Input
          name="location"
          value={selectedFilters.location}
          onChange={handleFilterChange}
          placeholder="Enter city or 'Remote'"
          className="w-full border rounded-md p-2"
        />
      </FilterSection>

      <div className="flex space-x-2">
        <Button onClick={applyFilters} className="bg-blue-500 text-white w-3/4">
          Apply Filters
        </Button>
        <Button
          onClick={removeFilter}
          className="bg-white text-black border w-1/4"
        >
          <X />
        </Button>
      </div>
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
