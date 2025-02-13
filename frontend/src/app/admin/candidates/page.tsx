"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { fetchCandidates, updateJobSeekerStatus } from "@/app/api/job-seeker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: boolean;
  createdAt: Date;
  image: string;
}

export default function UsersPage() {
  const [candidates, setCandidates] = useState<User[]>([]);

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await fetchCandidates();
        setCandidates(response.jobSeekers);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getCandidates();
  }, []);

  const toggleStatus = async (user: User) => {
    try {
      let response = await updateJobSeekerStatus(user.id);
      console.log(response);

      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.email === response.email ? response : candidate
        )
      );
      toast.success(`Candidate ${response.status?"unblocked":"blocked"} successfully`)
    } catch (err) {
      toast.error("Error toggling user status")
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-10 bg-gray-50"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Member Since
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((user) => (
                <tr key={user.email} className="border-b last:border-b-0">
                  <td className="flex items-center gap-3 px-6 py-4 whitespace-nowrap">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                    </Avatar>
                    {user.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 hover:bg-gray-100"
                    >
                      {user.status ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(user.createdAt).toLocaleString("en-US", {
                      weekday: "short", // 'Thu'
                      year: "numeric", // '2025'
                      month: "short", // 'Feb'
                      hour: "2-digit", // '03'
                      minute: "2-digit", // '39'
                      hour12: true, // 'AM/PM'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleStatus(user)}
                    >
                      {user.status ? "Block" : "Unblock"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
