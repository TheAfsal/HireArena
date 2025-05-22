"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Check, Filter } from "lucide-react"
import { fetchJobCategory } from "@/app/api/skills"
import type { CategoryType } from "@/app/admin/manage/components/category-type"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

function Filters({ onApplyFilters }: { onApplyFilters: (filters: any) => void }) {
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    category: "",
    location: "",
    level: "",
    skill: "",
    salaryMin: 0,
    salaryMax: 200000,
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setSelectedFilters({ ...selectedFilters, [e.target.name]: e.target.value })
  }

  const applyFilters = () => {
    onApplyFilters(selectedFilters)
  }

  const removeFilter = () => {
    const resetFilters = {
      type: "",
      category: "",
      location: "",
      level: "",
      skill: "",
      salaryMin: 0,
      salaryMax: 200000,
    }
    setSelectedFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  useEffect(() => {
    const getCategoryType = async () => {
      try {
        const response = await fetchJobCategory()
        setCategories(response)
      } catch (err) {
        console.error((err as Error).message)
      }
    }

    getCategoryType()
  }, [])

  useEffect(() => {
    // Count active filters
    let count = 0
    if (selectedFilters.type) count++
    if (selectedFilters.category) count++
    if (selectedFilters.location) count++
    if (selectedFilters.level) count++
    if (selectedFilters.skill) count++
    if (selectedFilters.salaryMin > 0 || selectedFilters.salaryMax < 200000) count++
    setActiveFiltersCount(count)
  }, [selectedFilters])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        {activeFiltersCount > 0 && (
          <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["type", "category", "skill", "location"]} className="space-y-4">
        <AccordionItem value="type" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Type of Employment</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <div className="space-y-2">
              {["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedFilters.type === type ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={selectedFilters.type === type}
                    onChange={handleFilterChange}
                    className="hidden"
                  />
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      selectedFilters.type === type ? "border-primary-600 bg-primary-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedFilters.type === type && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span>{type.replace("_", " ").toLowerCase()}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <select
              name="category"
              onChange={handleFilterChange}
              value={selectedFilters.category}
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skill" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Skills</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <div className="space-y-2">
              {["Adobe", "Figma", "React", "Node"].map((skill) => (
                <label
                  key={skill}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedFilters.skill === skill ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="skill"
                    value={skill}
                    checked={selectedFilters.skill === skill}
                    onChange={handleFilterChange}
                    className="hidden"
                  />
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      selectedFilters.skill === skill ? "border-primary-600 bg-primary-600" : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedFilters.skill === skill && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span>{skill}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Location</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <Input
              name="location"
              value={selectedFilters.location}
              onChange={handleFilterChange}
              placeholder="Enter city or 'Remote'"
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="salary" className="border-b-0">
          <AccordionTrigger className="py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium">Salary Range</span>
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>${selectedFilters.salaryMin.toLocaleString()}</span>
                <span>${selectedFilters.salaryMax.toLocaleString()}</span>
              </div>
              <Slider
                defaultValue={[selectedFilters.salaryMin, selectedFilters.salaryMax]}
                max={200000}
                step={5000}
                onValueChange={(value) => {
                  setSelectedFilters({
                    ...selectedFilters,
                    salaryMin: value[0],
                    salaryMax: value[1],
                  })
                }}
                className="mt-6"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-primary text-white"
        >
          Apply Filters
        </Button>
        <Button
          onClick={removeFilter}
          variant="outline"
          className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Filters
