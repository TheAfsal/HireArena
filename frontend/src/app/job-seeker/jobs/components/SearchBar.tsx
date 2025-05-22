"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute left-4 top-3.5 h-5 w-5 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            placeholder="Job title, keywords, or company"
            className="pl-12 h-12 text-base rounded-xl border-gray-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>

        <div className="relative md:w-1/3">
          <div className="absolute left-4 top-3.5 h-5 w-5 text-gray-400">
            <MapPin className="h-5 w-5" />
          </div>
          <Input
            placeholder="Location or 'Remote'"
            className="pl-12 h-12 text-base rounded-xl border-gray-200 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
        </div>

        <Button
          size="lg"
          className="h-12 px-8 rounded-xl bg-primary text-white shadow-md"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Jobs
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="text-sm font-medium">Popular:</div>
        {["Remote", "Full-time", "Software Engineer", "Marketing", "Design"].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setQuery(tag)
              onSearch(tag)
            }}
            className="text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
