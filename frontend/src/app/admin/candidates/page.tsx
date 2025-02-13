"use client"

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Member";
  status: "Active";
  memberSince: string;
}

const users: User[] = [
  {
    name: "Hannah Smith",
    email: "hannah@acme.co",
    role: "Admin",
    status: "Active",
    memberSince: "Aug 1, 2022",
  },
  {
    name: "Emily Davis",
    email: "emily@acme.co",
    role: "Recruiter",
    status: "Active",
    memberSince: "Jul 15, 2022",
  },
  {
    name: "Michael Johnson",
    email: "michael@acme.co",
    role: "Recruiter",
    status: "Active",
    memberSince: "Jun 28, 2022",
  },
  {
    name: "Sarah Miller",
    email: "sarah@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "Jun 12, 2022",
  },
  {
    name: "David Brown",
    email: "david@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "May 25, 2022",
  },
  {
    name: "Jessica White",
    email: "jessica@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "May 10, 2022",
  },
  {
    name: "William Lee",
    email: "william@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "Apr 22, 2022",
  },
  {
    name: "Olivia Garcia",
    email: "olivia@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "Apr 5, 2022",
  },
  {
    name: "Daniel Martinez",
    email: "daniel@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "Mar 18, 2022",
  },
  {
    name: "Sophia Lopez",
    email: "sophia@acme.co",
    role: "Member",
    status: "Active",
    memberSince: "Mar 3, 2022",
  },
];

export default function UsersPage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const response = await fetchCandidates();
        console.log(response);
        setCandidates(response);
      } catch (err) {
        console.log((err as Error).message);
      }
    };

    getCandidates();
  }, []);

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
                  Role
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
              {users.map((user, index) => (
                <tr key={user.email} className="border-b last:border-b-0">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant={user.role === "Admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 hover:bg-gray-100"
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {user.memberSince}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      View Details
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
