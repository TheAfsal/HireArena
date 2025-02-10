"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export type JobStatus = "Live" | "Closed"
export type JobType = "Fulltime" | "Freelance"

export interface Job {
  id: string
  role: string
  status: JobStatus
  datePosted: string
  dueDate: string
  jobType: JobType
  applicants: number
  needs: {
    filled: number
    total: number
  }
}

export const jobs: Job[] = [
    {
      id: "1",
      role: "Social Media Assistant",
      status: "Live",
      datePosted: "20 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 19,
      needs: {
        filled: 4,
        total: 11,
      },
    },
    {
      id: "2",
      role: "Senior Designer",
      status: "Live",
      datePosted: "16 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 1234,
      needs: {
        filled: 0,
        total: 20,
      },
    },
    {
      id: "3",
      role: "Visual Designer",
      status: "Live",
      datePosted: "15 May 2020",
      dueDate: "24 May 2020",
      jobType: "Freelance",
      applicants: 2435,
      needs: {
        filled: 1,
        total: 5,
      },
    },
    {
      id: "4",
      role: "Data Sience",
      status: "Closed",
      datePosted: "13 May 2020",
      dueDate: "24 May 2020",
      jobType: "Freelance",
      applicants: 6234,
      needs: {
        filled: 10,
        total: 10,
      },
    },
    {
      id: "5",
      role: "Kotlin Developer",
      status: "Closed",
      datePosted: "12 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 12,
      needs: {
        filled: 20,
        total: 20,
      },
    },
    {
      id: "6",
      role: "React Developer",
      status: "Closed",
      datePosted: "11 May 2020",
      dueDate: "24 May 2020",
      jobType: "Fulltime",
      applicants: 14,
      needs: {
        filled: 10,
        total: 10,
      },
    },
  ]


export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "role",
    header: "Roles",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant="outline"
          className={status === "Live" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "datePosted",
    header: "Date Posted",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "jobType",
    header: "Job Type",
    cell: ({ row }) => {
      const type = row.getValue("jobType") as string
      return (
        <Badge
          variant="outline"
          className={type === "Fulltime" ? "border-purple-500 text-purple-500" : "border-orange-500 text-orange-500"}
        >
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "applicants",
    header: "Applicants",
  },
  {
    accessorKey: "needs",
    header: "Needs",
    cell: ({ row }) => {
      const needs = row.getValue("needs") as { filled: number; total: number }
      return (
        <div className="text-right">
          {needs.filled} / {needs.total}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function JobList() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: jobs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-10 pt-10">
        <h2 className="text-2xl font-bold">Job List</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 border rounded-lg p-2">
            <Calendar className="h-4 w-4" />
            <span>Jul 19 - Jul 25</span>
          </div>
          <Button variant="outline">Filters</Button>
        </div>
      </div>
      <div className="rounded-md p-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-10 pb-10">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-500">View</p>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
            className="border rounded p-1"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
          <p className="text-sm text-gray-500">Applicants per page</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

