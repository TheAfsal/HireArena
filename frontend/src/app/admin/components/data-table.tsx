import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Column {
  key: string
  label: string
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  searchPlaceholder?: string
}

export function DataTable({ title, columns, data, searchPlaceholder }: DataTableProps) {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input type="search" placeholder={searchPlaceholder || "Search"} className="pl-10 bg-gray-50" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.key === "status" ? (
                        <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-100">
                          {item[column.key]}
                        </Badge>
                      ) : column.key === "actions" ? (
                        <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                          View
                        </Button>
                      ) : (
                        <span
                          className={column.key === "dateAdded" || column.key === "location" ? "text-gray-500" : ""}
                        >
                          {item[column.key]}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

