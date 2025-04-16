import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
                            variant={item[column.key] === "Inactive" ? "destructive" : "secondary"}
                            className={
                              item[column.key] !== "Inactive"
                                ? "bg-gray-100 hover:bg-gray-100"
                                : ""
                            }
                          >
                            {item[column.key] || "Active"}
                          </Badge>
                        ) : column.key === "actions" ? (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => onBlockUnblock(item.id)}
                              disabled={isLoading}
                            >
                              {item.status === "Inactive" ? "Activate" : "Deactivate"}
                            </Button>
                          </div>
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




// import { Expand, Search, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useState } from "react";

// interface Column {
//   key: string;
//   label: string;
// }

// interface DataTableProps {
//   title: string;
//   data: any[];
//   columns: Column[];
//   searchPlaceholder?: string;
//   onBlockUnblock: (companyName: string) => void;
//   onApproveVerification: (companyId: string) => void;
//   onRejectVerification: (companyId: string, reason: string) => void;
// }

// export function DataTable({
//   title,
//   data,
//   columns,
//   searchPlaceholder,
//   onBlockUnblock,
//   onApproveVerification,
//   onRejectVerification,
// }: DataTableProps) {
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");
//   const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

//   const handleRejectClick = (companyId: string) => {
//     setSelectedCompanyId(companyId);
//     setRejectReason("");
//     setShowRejectModal(true);
//   };

//   const handleRejectSubmit = () => {
//     if (selectedCompanyId && rejectReason.trim()) {
//       onRejectVerification(selectedCompanyId, rejectReason);
//       setShowRejectModal(false);
//       setSelectedCompanyId(null);
//       setRejectReason("");
//     }
//   };

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <h1 className="text-3xl font-bold mb-6">{title}</h1>

//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
//         <Input
//           type="search"
//           placeholder={searchPlaceholder || "Search"}
//           className="pl-10 bg-gray-50"
//         />
//       </div>

//       <div className="border rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 {columns.map((column) => (
//                   <th
//                     key={column.key}
//                     className="text-left px-6 py-3 text-sm font-medium text-gray-500"
//                   >
//                     {column.label}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index} className="border-b last:border-b-0">
//                   {columns.map((column) => (
//                     <td
//                       key={column.key}
//                       className="px-6 py-4 whitespace-nowrap"
//                     >
//                       {column.key === "status" ? (
//                         <Badge
//                           variant={
//                             item[column.key] === "Blocked" ? "destructive" : 
//                             item[column.key] === "Pending" ? "outline" : "secondary"
//                           }
//                           className={item[column.key] !== "Blocked" ? "bg-gray-100 hover:bg-gray-100" : ""}
//                         >
//                           {item[column.key] || "Active"}
//                         </Badge>
//                       ) : column.key === "actions" ? (
//                         <div className="flex space-x-2">
//                           {item.status !== "Pending" && (
//                             <Button
//                               variant="ghost"
//                               className="text-gray-500 hover:text-gray-700"
//                               onClick={() => onBlockUnblock(item.companyName)}
//                             >
//                               {item.status === "Blocked" ? "Unblock" : "Block"}
//                             </Button>
//                           )}
                          
//                           {item.status === "Pending" && (
//                             <div className="flex items-center gap-3 border p-2 rounded-lg">
//                               <span className="text-sm">Waiting for verification</span>
//                               <Button
//                                 variant="outline"
//                                 className="text-green-500 hover:text-green-800 border"
//                                 onClick={() => onApproveVerification(item.id)}
//                               >
//                                 Accept
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 className="text-red-500 hover:text-red-700 border"
//                                 onClick={() => handleRejectClick(item.id)}
//                               >
//                                 Reject
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 className="hover:text-gray-700 hover:scale-105 transition-transform border"
//                               >
//                                 <Expand />
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <span
//                           className={
//                             column.key === "dateAdded" ||
//                             column.key === "location"
//                               ? "text-gray-500"
//                               : ""
//                           }
//                         >
//                           {item[column.key]}
//                         </span>
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Rejection Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium">Rejection Reason</h3>
//               <Button 
//                 variant="ghost" 
//                 className="p-1 h-auto" 
//                 onClick={() => setShowRejectModal(false)}
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Please provide a reason for rejection:
//               </label>
//               <textarea
//                 className="w-full border rounded-md p-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 placeholder="Enter rejection reason..."
//               />
//             </div>
            
//             <div className="flex justify-end gap-2">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowRejectModal(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 variant="default"
//                 onClick={handleRejectSubmit}
//                 disabled={!rejectReason.trim()}
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
