"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCandidates, updateJobSeekerStatus } from "@/app/api/job-seeker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [filteredCandidates, setFilteredCandidates] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await fetchCandidates();
        setCandidates(response.jobSeekers);
        setFilteredCandidates(response.jobSeekers);
        setTotal(response.jobSeekers.length);
      } catch (err) {
        console.log((err as Error).message);
        toast.error("Error fetching candidates");
      } finally {
        setIsLoading(false);
      }
    };

    getCandidates();
  }, []);

  useEffect(() => {
    // Filter candidates based on search term
    const filtered = candidates.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCandidates(filtered);
    setTotal(filtered.length);
    setPage(1); // Reset to first page on search
  }, [searchTerm, candidates]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      const response = await updateJobSeekerStatus(selectedUser.id);
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.email === response.email ? response : candidate
        )
      );
      setFilteredCandidates((prevFiltered) =>
        prevFiltered.map((candidate) =>
          candidate.email === response.email ? response : candidate
        )
      );
      toast.success(`Candidate ${response.status ? "unblocked" : "blocked"} successfully`);
    } catch (err) {
      toast.error("Error toggling user status");
    } finally {
      setSelectedUser(null);
    }
  };

  // Calculate paginated candidates
  const paginatedCandidates = filteredCandidates.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="relative mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search by name or email"
            className="pl-10 bg-gray-50"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : paginatedCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No candidates found
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((user) => (
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
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedUser(user)}
                            disabled={isLoading}
                          >
                            {user.status ? "Block" : "Unblock"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {user.status
                                ? `Block ${user.fullName}?`
                                : `Unblock ${user.fullName}?`}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action can be reversed later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setSelectedUser(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={confirmToggleStatus}>
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}