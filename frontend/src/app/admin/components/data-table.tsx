import {
  Search,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import moment from "moment";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  searchPlaceholder?: string;
  onBlockUnblock: (companyName: string) => void;
  onApproveVerification: (companyId: string) => void;
  onRejectVerification: (companyId: string, reason: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onSearch: (term: string) => void; // Kept for compatibility
  onSearchButtonClick: (term: string) => void; // New prop for button-based search
  searchInput: string; // New prop for search input value
  setSearchInput: (term: string) => void; // New prop for updating search input
  isLoading: boolean;
}

export function DataTable({
  title,
  data,
  columns,
  searchPlaceholder,
  onBlockUnblock,
  onApproveVerification,
  onRejectVerification,
  page,
  pageSize,
  total,
  onPageChange,
  onSearch,
  onSearchButtonClick,
  searchInput,
  setSearchInput,
  isLoading,
}: DataTableProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  const handleRejectClick = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (selectedCompanyId && rejectReason.trim()) {
      onRejectVerification(selectedCompanyId, rejectReason);
      setShowRejectModal(false);
      setSelectedCompanyId(null);
      setRejectReason("");
    }
  };

  const handleSearch = () => {
    onSearchButtonClick(searchInput);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      {/* Search */}
      <div className="relative mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder={searchPlaceholder || "Search"}
            className="pl-10 bg-gray-50"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchInput.trim()}>
          Search
        </Button>
      </div>

      {/* Table */}
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
                    No companies found
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
                              item[column.key] === "Blocked"
                                ? "destructive"
                                : item[column.key] === "Pending"
                                ? "outline"
                                : "secondary"
                            }
                            className={
                              item[column.key] !== "Blocked"
                                ? "bg-gray-100 hover:bg-gray-100"
                                : ""
                            }
                          >
                            {item[column.key] || "Active"}
                          </Badge>
                        ) : column.key === "actions" ? (
                          <div className="flex space-x-2">
                            {item.status !== "Pending" ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="text-gray-500 hover:text-gray-700"
                                    disabled={isLoading}
                                  >
                                    {item.status === "Blocked" ? "Unblock" : "Block"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you sure you want to{" "}
                                      {item.status === "Blocked" ? "unblock" : "block"}{" "}
                                      {item.companyName}?
                                    </AlertDialogTitle>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onBlockUnblock(item.companyName)}
                                    >
                                      Confirm
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <div className="flex items-center gap-3 border p-2 rounded-lg">
                                <span className="text-sm text-gray-600">
                                  Waiting for verification
                                </span>
                                <Button
                                  variant="outline"
                                  className="text-green-600 border"
                                  onClick={() => onApproveVerification(item.id)}
                                  disabled={isLoading}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  className="text-red-600 border"
                                  onClick={() => handleRejectClick(item.id)}
                                  disabled={isLoading}
                                >
                                  Reject
                                </Button>
                                <Button
                                  variant="outline"
                                  className="hover:text-gray-700 hover:scale-105 transition-transform border"
                                  disabled={isLoading}
                                >
                                  <Expand />
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : column.key === "createdAt" ? (
                          <span>{moment(item[column.key]).format("LLL")}</span>
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

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Rejection Reason</h3>
              <Button
                variant="ghost"
                className="p-1 h-auto"
                onClick={() => setShowRejectModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Please provide a reason for rejection:
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-32"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}