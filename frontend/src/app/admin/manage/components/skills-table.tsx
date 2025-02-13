"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  status: boolean;
  jobCategory: string;
  createdAt: string;
  modifiedAt: string;
}

export default function SkillsTable() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddSkill = async (name: string, jobCategory: string) => {
    console.log(name, jobCategory);

    const response = await AddSkills(name, jobCategory);
    setSkills([
      ...skills,
      {...response, jobCategory:response.jobCategory.name},
    ]);
  };

  const handleEditSkill = (
    id: number,
    name: string,
    techStack: string,
    jobCategory: string
  ) => {
    // setSkills(
    //   skills.map((skill) =>
    //     skill.id === id ? { ...skill, name, techStack, jobCategory } : skill
    //   )
    // );
  };

  useEffect(() => {
    const getSkills = async () => {
      try {
        const response = await fetchSkills();
        console.log(response);
        setSkills(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getSkills();
  }, []);

  return (
    <div className="border rounded-2xl p-2">
      <div className="bg-red-300 flex items-center justify-between mb-4 border p-3 rounded-2xl">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Skills</h1>
          <p className="text-muted-foreground text-sm">
            Manage the skills for each tech stack and job category.
          </p>
        </div>
        <AddSkillDialog onAddSkill={handleAddSkill}>
          <Button variant="outline" className="flex items-center rounded-xl">
            <PlusCircle className="mr-2" /> Add Skill
          </Button>
        </AddSkillDialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Skill</TableHead>
            <TableHead>Job Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>{skill.name}</TableCell>
              <TableCell>{skill.jobCategory}</TableCell>
              <TableCell>
                {new Date(skill.createdAt).toLocaleString("en-GB", {
                  year: "numeric", // e.g., "2025"
                  month: "long", // e.g., "February"
                  day: "numeric", // e.g., "12"
                })}
              </TableCell>
              <TableCell>{new Date(skill.modifiedAt).toLocaleString("en-GB", {
                  year: "numeric", // e.g., "2025"
                  month: "long", // e.g., "February"
                  day: "numeric", // e.g., "12"
                })}</TableCell>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() => {
                    //@ts-ignore
                    setSelectedSkill(skill);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="link"
                  className="text-red-600 ml-2"
                  onClick={() => {
                    setSkills(skills.filter((item) => item.id !== skill.id));
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSkill && (
        <EditSkillDialog
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          skill={selectedSkill}
          onEditSkill={handleEditSkill}
        />
      )}
    </div>
  );
}

export function AddSkillDialog({
  onAddSkill,
  children,
}: {
  onAddSkill: Function;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [jobCategory, setJobCategory] = useState<Category[]>([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillName && jobCategory) {
      onAddSkill(skillName, selectedJobCategory);
      setOpen(false);
    }
  };

  useEffect(() => {
    const getJobCategory = async () => {
      try {
        const response = await fetchJobCategory();
        console.log(response);

        setJobCategory(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getJobCategory();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill name</Label>
            <Input
              id="skillName"
              placeholder="React, Python, Design, etc..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryType">Category Type</Label>
            <select
              id="categoryType"
              value={selectedJobCategory}
              onChange={(e) => {
                console.log(e.target.value);
                setSelectedJobCategory(e.target.value);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category Type</option>
              {jobCategory.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">
            Add Skill
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AddSkills, fetchJobCategory, fetchSkills } from "@/app/api/skills";
import { Category } from "./job-category";

interface EditSkillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  skill: { id: number; name: string; techStack: string; jobCategory: string };
  onEditSkill: (
    id: number,
    name: string,
    techStack: string,
    jobCategory: string
  ) => void;
}

export const EditSkillDialog = ({
  isOpen,
  onClose,
  skill,
  onEditSkill,
}: EditSkillDialogProps) => {
  const [skillName, setSkillName] = useState(skill.name);
  const [techStack, setTechStack] = useState(skill.techStack);
  const [jobCategory, setJobCategory] = useState(skill.jobCategory);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.name);
      setTechStack(skill.techStack);
      setJobCategory(skill.jobCategory);
    }
  }, [skill]);

  const handleEditSkill = () => {
    if (skillName && techStack && jobCategory) {
      onEditSkill(skill.id, skillName, techStack, jobCategory);
      onClose(); // Close modal after editing
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              id="skillName"
              placeholder="Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="techStack">Tech Stack</Label>
            <select
              id="techStack"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobCategory">Job Category</Label>
            <select
              id="jobCategory"
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Software Engineer">Software Engineer</option>
              <option value="Designer">Designer</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="link" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEditSkill}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { EditSkillDialog } from "./edit-skill-dialog";
// import { Skill } from "../page";
// import { AddSkillDialog } from "./add-skill-dialog";
// import { PlusCircle } from "lucide-react";

// export default function SkillsTable() {
//   const skills = [
//     {
//       skill: "Python",
//       techStack: "Backend",
//       jobCategory: "Software Engineer",
//       jobLevel: "Mid",
//       created: "02/01/2022",
//       modified: "02/01/2022",
//     },
//     {
//       skill: "React",
//       techStack: "Frontend",
//       jobCategory: "Software Engineer",
//       jobLevel: "Mid",
//       created: "02/01/2022",
//       modified: "02/01/2022",
//     },
//     {
//       skill: "SQL",
//       techStack: "Database",
//       jobCategory: "Software Engineer",
//       jobLevel: "Mid",
//       created: "02/01/2022",
//       modified: "02/01/2022",
//     },
//     {
//       skill: "AWS",
//       techStack: "DevOps",
//       jobCategory: "Software Engineer",
//       jobLevel: "Mid",
//       created: "02/01/2022",
//       modified: "02/01/2022",
//     },
//     {
//       skill: "REST",
//       techStack: "API",
//       jobCategory: "Software Engineer",
//       jobLevel: "Mid",
//       created: "02/01/2022",
//       modified: "02/01/2022",
//     },
//   ]

//   return (
//     <div className="border rounded-2xl p-2">
//         <div className="flex items-center justify-between mb-4 border p-3 rounded-2xl">
//          <div>
//            <h1 className="text-2xl font-semibold mb-1">Job categories</h1>
//            <p className="text-muted-foreground text-sm">
//              Job categories help you organize your jobs and better match
//              candidates.
//            </p>
//          </div>
//          <AddSkillDialog>
//            <Button className="rounded-xl">
//              <PlusCircle className="mr-2 h-4 w-4" />
//              Add new category
//            </Button>
//          </AddSkillDialog>
//        </div>
//       <Table >
//         <TableHeader>
//           <TableRow>
//             <TableHead>Skill</TableHead>
//             <TableHead>Tech Stack</TableHead>
//             <TableHead>Job Category</TableHead>
//             <TableHead>Created</TableHead>
//             <TableHead>Modified</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {skills.map((skill) => (
//             <TableRow key={skill.skill}>
//               <TableCell>{skill.skill}</TableCell>
//               <TableCell>
//                 <span className="text-blue-600 hover:underline cursor-pointer">
//                   {skill.techStack}
//                 </span>
//               </TableCell>
//               <TableCell>
//                 <span className="text-blue-600 hover:underline cursor-pointer">
//                   {skill.jobCategory}
//                 </span>
//               </TableCell>
//               <TableCell>{skill.created}</TableCell>
//               <TableCell>{skill.modified}</TableCell>
//               <TableCell>
//                 <Button variant="link" className="text-blue-600 p-0">
//                   Edit
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
