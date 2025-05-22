"use client";

import { useState, useEffect } from "react";
import moment from "moment";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input as DateInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  key: string;
  label: string;
}

interface FilterParams {
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  department?: string;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  searchPlaceholder?: string;
  onBlockUnblock: (jobId: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: Partial<FilterParams>) => void;
  isLoading: boolean;
}

export function DataTable({
  title,
  data,
  columns,
  searchPlaceholder,
  onBlockUnblock,
  page,
  pageSize,
  total,
  onPageChange,
  onFilterChange,
  isLoading,
}: DataTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [viewDetails, setViewDetails] = useState<any | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    onFilterChange({
      searchTerm,
      startDate,
      endDate,
      status: status === "all" ? undefined : status,
      department: department === "all" ? undefined : department,
    });
  }, [searchTerm, startDate, endDate, status, department, onFilterChange]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatus("");
    setDepartment("");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 items-end w-full">
        <div className="w-full">
          <Label>Start Date</Label>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <Label>End Date</Label>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="col-span-2 w-full">
          <Label>Search</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder={searchPlaceholder || "Search"}
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
        </div>

        <div className="w-full">
          <Label className="invisible">Clear</Label>
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={isLoading}
            className="w-full"
          >
            Clear filter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left px-6 py-3 text-sm font-medium text-gray-500"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    No jobs found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {column.key === "status" ? (
                          <Badge
                            variant={
                              item[column.key] === "Inactive"
                                ? "destructive"
                                : "secondary"
                            }
                            className={
                              item[column.key] !== "Inactive"
                                ? "bg-gray-100 hover:bg-gray-100"
                                : ""
                            }
                          >
                            {item[column.key] || "Active"}
                          </Badge>
                        ) : column.key === "updatedAt" ? (
                          <span>
                            {moment(item[column.key]).format(
                              "MMM D, YYYY, h:mm A"
                            )}
                          </span>
                        ) : column.key === "actions" ? (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setViewDetails(item)}
                              disabled={isLoading}
                            >
                              View Details
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="text-gray-500 hover:text-gray-700"
                                  onClick={() => setSelectedItem(item)}
                                  disabled={isLoading}
                                >
                                  {item.status === "Inactive"
                                    ? "Activate"
                                    : "Deactivate"}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to{" "}
                                    {item.status === "Inactive"
                                      ? "activate"
                                      : "deactivate"}{" "}
                                    this job?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      onBlockUnblock(item.id);
                                      setSelectedItem(null);
                                    }}
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ) : (
                          <span>{item[column.key] || "N/A"}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewDetails?.jobTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <p>{viewDetails?.jobDescription || "N/A"}</p>
            </div>
            <div>
              <Label>Department</Label>
              <p>{viewDetails?.department || "N/A"}</p>
            </div>
            <div>
              <Label>Location</Label>
              <p>{viewDetails?.location || "N/A"}</p>
            </div>
            <div>
              <Label>Status</Label>
              <p>{viewDetails?.status || "Active"}</p>
            </div>
            <div>
              <Label>Posted</Label>
              <p>{viewDetails ? moment(viewDetails.updatedAt).format("MMM D, YYYY, h:mm A") : "N/A"}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
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
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
