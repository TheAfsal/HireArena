"use client";

import { useState } from "react";
import moment from "moment";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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

interface Column {
  key: string;
  label: string;
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
  onSearch: (term: string) => void;
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
  onSearch,
  isLoading,
}: DataTableProps) {
  const totalPages = Math.ceil(total / pageSize);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="search"
          placeholder={searchPlaceholder || "Search"}
          className="pl-10 bg-gray-50"
          onChange={(e) => onSearch(e.target.value)}
          disabled={isLoading}
        />
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
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap">
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
                          <span>{moment(item[column.key]).format("MMM D, YYYY, h:mm A")}</span>
                        ) : column.key === "actions" ? (
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
                                  {item.status === "Inactive" ? "activate" : "deactivate"} this job?
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
                        ) : (
                          <span>{item[column.key]}</span>
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
