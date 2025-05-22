"use client"

import { useState, useEffect } from "react"
import JobList from "./components/JobList"
import SearchBar from "./components/SearchBar"
import Filters from "./components/Filters"
import { BriefcaseIcon, Sparkles } from "lucide-react"

const Page = () => {
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [combinedFilters, setCombinedFilters] = useState({})
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  useEffect(() => {
    setCombinedFilters({ ...filters, searchQuery })
  }, [filters, searchQuery])

  const handleApplyFilters = (selectedFilters: any) => {
    setFilters(selectedFilters)
    setIsMobileFilterOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-50 p-2 rounded-full">
                <BriefcaseIcon className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Find Your Dream Job
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Premium Jobs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={(query) => setSearchQuery(query)} />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden px-4 sm:px-6 lg:px-8 mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
        >
          <span className="font-medium">Filters</span>
          <span className="text-primary-600">{isMobileFilterOpen ? "Hide" : "Show"}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Mobile */}
          <div
            className={`md:hidden ${
              isMobileFilterOpen ? "block" : "hidden"
            } bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6`}
          >
            <Filters onApplyFilters={handleApplyFilters} />
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:block w-80 shrink-0">
            <div className="sticky top-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <Filters onApplyFilters={handleApplyFilters} />
            </div>
          </div>

          {/* Job List */}
          <div className="flex-1">
            <JobList filters={combinedFilters} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
