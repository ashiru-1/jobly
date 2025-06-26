"use client"

import type { JobFilters } from "@/types/job"
import { Search, Filter, X, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCallback, useMemo, memo, useState, useRef, useEffect } from "react"

interface JobFiltersComponentProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters) => void
  onClearAll: () => void
  jobCount: number
  jobs?: any[]
}

// Memoize the component to prevent unnecessary re-renders
const JobFiltersComponent = memo(function JobFiltersComponent({
  filters,
  onFiltersChange,
  onClearAll,
  jobCount,
  jobs = [],
}: JobFiltersComponentProps & { jobs?: any[] }) {
  // Dynamically get unique job types from jobs
  const jobTypes = useMemo(() => {
    const types = jobs.map((job) => job.type).filter(Boolean)
    return Array.from(new Set(types)).sort()
  }, [jobs])

  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, search: value })
    },
    [filters, onFiltersChange],
  )

  const handleTypeChange = useCallback(
    (type: string, checked: boolean) => {
      const newTypes = checked ? [...filters.types, type] : filters.types.filter((t) => t !== type)
      onFiltersChange({ ...filters, types: newTypes })
    },
    [filters, onFiltersChange],
  )

  const hasActiveFilters = useMemo(
    () => filters.search || filters.types.length > 0,
    [filters.search, filters.types.length],
  )
  const activeFilterCount = useMemo(
    () => filters.types.length + (filters.search ? 1 : 0),
    [filters.types.length, filters.search],
  )

  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false)
      }
    }
    if (showTypeDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showTypeDropdown])

  return (
    <div className="w-full">
      {/* Desktop Sidebar Layout */}
      <div className="hidden lg:block lg:w-80">
        <div className="sticky top-32 space-y-6">
          {/* Search */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                  <Search className="h-4 w-4 text-white" />
                </div>
                Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base border-0 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 transition-colors rounded-xl"
                />
                {filters.search && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Type Filter */}
          <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg font-semibold text-slate-900 dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  Job Type
                </CardTitle>
                {filters.types.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({ ...filters, types: [] })}
                    className="text-xs h-8 px-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  onClick={() => handleTypeChange(type, !filters.types.includes(type))}
                >
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.types.includes(type)}
                    onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500 border-2"
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-base font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex-1"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              onClick={onClearAll}
              className="w-full h-12 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all transform hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}

          {/* Active Filters Count */}
          {hasActiveFilters && (
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout intentionally left blank: filter handled by nav sidebar */}
    </div>
  )
})

export { JobFiltersComponent as JobFilters }
