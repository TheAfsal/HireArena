"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AddTechStackModal } from "./add-tech-stack-modal";
import { EditTechStackModal } from "./edit-tech-stack-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTechStack, EditTechStack, fetchTechStack } from "@/app/api/skills";

interface TechStack {
  id: string;
  name: string;
  status: boolean;
}

export default function TechStackTable() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTechStack, setSelectedTechStack] = useState(null);

  const handleEditTechStack = async (id: string, name: string) => {
    const response = await EditTechStack(id, name);
    console.log(response);

    setTechStacks(
      techStacks.map((techStack) =>
        techStack.id === response.id ? response : techStack
      )
    );
  };

  const handleAddTechStack = async (name: string) => {
    const response = await AddTechStack(name);
    console.log(response);
    setTechStacks([...techStacks, response]);
  };

  useEffect(() => {
    const getTechStack = async () => {
      try {
        const response = await fetchTechStack();
        console.log(response);

        setTechStacks(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getTechStack();
  }, []);

  return (
    <div className="border rounded-2xl p-2">
      <div className="bg-green-300 flex items-center justify-between mb-4 border p-3 rounded-2xl">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Tech Stack Types</h1>
          <p className="text-muted-foreground text-sm">
            Tech stacks help you organize the technology used in different job
            roles.
          </p>
        </div>
        <AddTechStackModal onAddTechStack={handleAddTechStack} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tech Stack Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {techStacks.map((techStack) => (
            <TableRow key={techStack.id}>
              <TableCell>{techStack.name}</TableCell>
              <TableCell>
                <span
                  className={`text-${
                    techStack.status ? "green" : "red"
                  }-600 font-bold`}
                >
                  {techStack.status ? "Active" : "Disabled"}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  className="text-blue-600 p-0"
                  onClick={() => {
                    //@ts-ignore
                    setSelectedTechStack(techStack);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="link"
                  className="text-red-600 p-0 ml-2"
                  onClick={() => {
                    const updatedTechStacks = techStacks.map((stack) =>
                      stack.id === techStack.id
                        ? {
                            ...stack,
                            status: stack.status ? "Suspended" : "Active",
                          }
                        : stack
                    );
                    // setTechStacks(updatedTechStacks);
                  }}
                >
                  {techStack.status ? "Suspend" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTechStack && (
        <EditTechStackModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          techStack={selectedTechStack}
          onEditTechStack={handleEditTechStack}
        />
      )}
    </div>
  );
}
