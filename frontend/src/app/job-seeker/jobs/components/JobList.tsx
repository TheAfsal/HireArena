"use client"

import { useEffect, useState } from "react"
import JobCard from "./JobCard"
import { fetchJobsFiltered } from "@/app/api/job"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, ListFilter, Grid2X2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function JobList({ filters }: { filters: any }) {
  const [jobs, setJobs] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  useEffect(() => {
    fetchJobs(1)
  }, [filters])

  const fetchJobs = async (page: number) => {
    setLoading(true)
    try {
      const response = await fetchJobsFiltered(filters, page, pagination.pageSize)
      setJobs(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error("Error fetching jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchJobs(newPage)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Available Positions{" "}
            <Badge variant="outline" className="ml-2 bg-primary-50 text-primary-700 border-primary-200">
              {pagination.total}
            </Badge>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {jobs.length} of {pagination.total} jobs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-white shadow-sm text-primary-600" : "text-gray-500"
              }`}
            >
              <ListFilter className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-white shadow-sm text-primary-600" : "text-gray-500"
              }`}
            >
              <Grid2X2 className="h-4 w-4" />
            </button>
          </div>

          <select
            className="bg-gray-100 border-0 rounded-lg p-2 text-sm focus:ring-primary-500"
            onChange={(e) => {
              const newPageSize = Number.parseInt(e.target.value)
              setPagination({ ...pagination, pageSize: newPageSize })
              fetchJobs(1)
            }}
            value={pagination.pageSize}
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12" aria-live="polite">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
          <p className="text-gray-500">Searching for the perfect opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <ListFilter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search filters or try a different search term to find more opportunities.
          </p>
        </div>
      ) : (
        <>
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} viewMode={viewMode} />
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} results
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1 || loading}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="h-9 px-4 border-gray-200"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-9 w-9 flex items-center justify-center rounded-md text-sm ${
                        pagination.page === pageNum
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                {pagination.totalPages > 5 && <span className="px-1">...</span>}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages || loading}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="h-9 px-4 border-gray-200"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default JobList
