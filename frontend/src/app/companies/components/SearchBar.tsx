"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

 function SearchBar() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input placeholder="Search" className="pl-10" />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input placeholder="Florence, Italy" className="pl-10" />
        </div>
        <Button size="lg" className="px-8">
          Search
        </Button>
      </div>
      <div className="mt-2 text-sm text-gray-500">Popular: Twitter, Microsoft, Apple, Facebook</div>
    </div>
  )
}

export default SearchBar;