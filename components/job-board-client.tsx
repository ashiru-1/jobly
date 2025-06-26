"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Job, JobFilters } from "@/types/job"
import { JobCard } from "@/components/job-card"
import { JobDetailsModal } from "@/components/job-details-modal"
import { JobFilters as JobFiltersComponent } from "@/components/job-filters"
import { ThemeToggle } from "@/components/theme-toggle"
import { InitialJobsSkeleton } from "@/components/job-loading"
import { Briefcase, Sparkles, Globe, RefreshCw, Info, Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay])
  return debouncedValue
}

export default function JobBoardClient({ jobs: initialJobs }: { jobs: Job[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>("remotive")
  const [dataMessage, setDataMessage] = useState<string>("Live data from Remotive")
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    types: [],
    categories: [],
  })
  const isInitialized = useRef(false)
  const debouncedSearch = useDebounce(filters.search, 500)
  const searchTerms = useMemo(() => {
    if (!debouncedSearch) return []
    return debouncedSearch
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 0)
  }, [debouncedSearch])
  const filteredJobs = useMemo(() => {
    if (jobs.length === 0) return []
    if (!debouncedSearch && filters.types.length === 0) {
      return jobs
    }
    const hasTypeFilter = filters.types.length > 0
    const hasSearchFilter = searchTerms.length > 0
    return jobs.filter((job) => {
      if (hasTypeFilter && !filters.types.includes(job.type)) {
        return false
      }
      if (hasSearchFilter) {
        const searchableText = `${job.title} ${job.company} ${job.tags?.join(" ") || ""}`.toLowerCase()
        if (!searchTerms.every((term) => searchableText.includes(term))) {
          return false
        }
      }
      return true
    })
  }, [jobs, debouncedSearch, searchTerms, filters.types])

  useEffect(() => {
    if (isInitialized.current) return
    const urlSearch = searchParams.get("search") || ""
    const urlTypes = searchParams.get("types")?.split(",").filter(Boolean) || []
    setFilters({
      search: urlSearch,
      types: urlTypes,
      categories: [],
    })
    isInitialized.current = true
  }, [searchParams])

  useEffect(() => {
    if (!isInitialized.current) return
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (filters.search.trim()) {
        params.set("search", filters.search.trim())
      }
      if (filters.types.length > 0) {
        params.set("types", filters.types.join(","))
      }
      const newUrl = params.toString() ? `?${params.toString()}` : "/"
      router.replace(newUrl, { scroll: false })
    }, 1000)
    return () => clearTimeout(timeoutId)
  }, [filters.search, filters.types, router])

  const handleJobClick = useCallback((job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }, [])
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setSelectedJob(null)
  }, [])
  const clearAllFilters = useCallback(() => {
    setFilters({ search: "", types: [], categories: [] })
    setSidebarSearch("")
  }, [])
  const handleFiltersChange = useCallback((newFilters: JobFilters) => {
    setFilters(newFilters)
  }, [])
  const jobCount = useMemo(() => jobs.length, [jobs.length])
  const filteredJobCount = useMemo(() => filteredJobs.length, [filteredJobs.length])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarSearch, setSidebarSearch] = useState("")
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)
  const [tempTypes, setTempTypes] = useState<string[]>(filters.types)
  const sidebarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sidebarOpen && sidebarInputRef.current) {
      sidebarInputRef.current.focus()
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (filterSidebarOpen) setTempTypes(filters.types)
  }, [filterSidebarOpen, filters.types])

  const sidebarResults = useMemo(() => {
    if (!sidebarSearch.trim()) return []
    const term = sidebarSearch.toLowerCase()
    return jobs.filter(job =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term)
    )
  }, [sidebarSearch, jobs])

  const hasActiveFilters = filters.types.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Sticky Nav/Header */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 shadow-sm flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
            Jobly
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Filter Icon (mobile only) */}
          <button
            className="block lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Open filter sidebar"
            onClick={() => setFilterSidebarOpen(true)}
          >
            <Filter className="h-6 w-6 text-slate-700 dark:text-slate-200" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{filters.types.length}</span>
            )}
          </button>
          {/* Search Icon (mobile only) */}
          <button
            className="block lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Open search sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <Search className="h-6 w-6 text-slate-700 dark:text-slate-200" />
          </button>
        </div>
      </nav>

      {/* Filter Sidebar Drawer (mobile) */}
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFilterSidebarOpen(false)} />
          {/* Sidebar */}
          <aside className="relative w-80 max-w-full h-full bg-white dark:bg-slate-900 shadow-xl p-6 flex flex-col animate-in slide-in-from-left-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-slate-900 dark:text-white">Job Type</span>
              <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setFilterSidebarOpen(false)} aria-label="Close sidebar">
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {jobs
                .map((job) => job.type)
                .filter((v, i, a) => a.indexOf(v) === i && v)
                .sort()
                .map((type) => (
                  <label key={type} className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) setTempTypes([...tempTypes, type])
                        else setTempTypes(tempTypes.filter((t) => t !== type))
                      }}
                      className="accent-blue-600 w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-700"
                    />
                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">{type}</span>
                  </label>
                ))}
            </div>
            <div className="pt-4 flex gap-2 sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => {
                  setTempTypes([])
                  setFilterSidebarOpen(false)
                  handleFiltersChange({ ...filters, types: [] })
                }}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg"
                type="button"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setFilterSidebarOpen(false)
                  handleFiltersChange({ ...filters, types: tempTypes })
                }}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
                type="button"
              >
                {`Show all (${jobs.filter(job => tempTypes.length === 0 || tempTypes.includes(job.type)).length})`}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar Drawer for Search */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar */}
          <aside className="relative w-80 max-w-full h-full bg-white dark:bg-slate-900 shadow-xl p-6 flex flex-col animate-in slide-in-from-left-8">
            <div className="flex items-center mb-4">
              <input
                ref={sidebarInputRef}
                type="text"
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                placeholder="Search jobs..."
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarSearch.trim() ? (
                sidebarResults.length > 0 ? (
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {sidebarResults.map(job => (
                      <li key={job.id} className="py-3">
                        <div className="font-semibold text-slate-900 dark:text-white">{job.title}</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">{job.company}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400 text-center mt-8">No results found.</div>
                )
              ) : (
                <div className="text-slate-400 text-center mt-8">Type to search jobs...</div>
              )}
            </div>
            <button className="mt-4 w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
              disabled={!sidebarSearch.trim() || sidebarResults.length === 0}
              onClick={() => {
                handleFiltersChange({ ...filters, search: sidebarSearch })
                setSidebarOpen(false)
              }}>
              Showing all {sidebarResults.length} result{sidebarResults.length !== 1 ? "s" : ""}
            </button>
          </aside>
        </div>
      )}

      {/* Sticky Theme Toggler at Bottom Side */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-full p-2 flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Data Source Alert */}
        {(dataSource === "api_error" || dataSource === "api_empty") && (
          <Alert className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800" role="alert">
            <Info className="h-4 w-4 text-yellow-600" aria-hidden="true" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              {dataMessage} - Only showing real job postings from external APIs.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters - sticky at top below header */}
          <div className="lg:hidden sticky top-[80px] z-40">
            <JobFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={clearAllFilters}
              jobCount={jobCount}
              jobs={jobs}
            />
          </div>
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0 sticky top-24 h-[calc(100vh-6rem)]">
            <JobFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={clearAllFilters}
              jobCount={jobCount}
              jobs={jobs}
            />
          </aside>
          {/* Jobs List */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {loading ? "Loading..." : `${filteredJobCount} Remote Jobs Found`}
                    </h2>
                    {!loading && filteredJobCount > 0 && <Sparkles className="h-5 w-5 text-yellow-500" aria-hidden="true" />}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {loading
                      ? "Fetching the latest remote opportunities..."
                      : "Discover amazing remote opportunities from top companies"}
                  </p>
                </div>
                {!loading && (filters.search || filters.types.length > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Clear all filters"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            {loading ? (
              <InitialJobsSkeleton count={8} />
            ) : error ? (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Unable to load jobs</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  We're having trouble connecting to job providers. Please check your internet connection and try again.<br />
                  <span className="block mt-2">If the problem persists, try refreshing the page or come back later.</span>
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-base min-w-[150px]"
                  aria-label="Try Again"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Try Again
                </Button>
              </div>
            ) : jobCount === 0 && !loading ? (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No jobs available</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  There are currently no remote jobs available from our job providers.<br />
                  <span className="block mt-2">Try refreshing or check back later for new opportunities.</span>
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-base min-w-[150px]"
                  aria-label="Refresh Jobs"
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  Refresh Jobs
                </Button>
              </div>
            ) : filteredJobCount === 0 ? (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No remote jobs found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  We couldn't find any remote jobs matching your criteria.<br />
                  <span className="block mt-2">Try adjusting your search or filters.</span>
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-base min-w-[150px]"
                  aria-label="Clear all filters"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <JobDetailsModal job={selectedJob} isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  )
} 