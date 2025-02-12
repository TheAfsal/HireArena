import { Button } from "@/components/ui/button";
import SkillsTable from "./components/skills-table";
import { AddSkillDialog } from "./components/add-skill-dialog";
import { PlusCircle } from "lucide-react";
import CategoryTypesTable from "./components/category-type";
import TechStackTable from "./components/tech-stack-table";
import JobCategoryTable from "./components/job-category";

export interface Skill {
  id: string;
  name: string;
  primaryTechStack: string;
  secondaryTechStack?: string;
  jobCategories: string[];
}

export interface JobCategory {
  id: string;
  name: string;
}

export default function Page() {
  return (
    <div className="flex flex-col p-6 max-w-7xl mx-auto gap-5">
      <CategoryTypesTable />
      <JobCategoryTable />
      <SkillsTable />
      {/* <TechStackTable /> */}
    </div>
  );
}
