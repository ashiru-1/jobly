"use client"

import type { Job } from "@/types/job"
import { MapPin, Clock, DollarSign, Building2, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { memo, useState, useRef, useEffect } from "react"

interface JobCardProps {
  job: Job
  onClick: () => void
}

// Observer hook for lazy loading
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [hasIntersected, options])

  return { elementRef, isIntersecting, hasIntersected }
}

// Skeleton component for loading state
function JobCardSkeleton() {
  return (
    <Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 w-3/4 animate-pulse"></div>
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2 animate-pulse"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Memoize JobCard to prevent unnecessary re-renders
export const JobCard = memo(function JobCard({ job, onClick }: JobCardProps) {
  const { elementRef, hasIntersected } = useIntersectionObserver()

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
      case "Part-time":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
      case "Contract":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
      case "Remote":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25"
      default:
        return "bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-lg shadow-slate-500/25"
    }
  }

  return (
    <div ref={elementRef} className="w-full">
      {!hasIntersected ? (
        <JobCardSkeleton />
      ) : (
        <Card
          className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4  w-full"
          onClick={onClick}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <CardContent className="relative p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-4 sm:mb-6 gap-4 sm:gap-0">
              <div className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 flex-1 w-full">
                <div className="relative mb-2 sm:mb-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg sm:text-2xl select-none">
                      {job.company
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map(word => word[0].toUpperCase())
                        .join("")}
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm sm:text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    {job.company}
                  </p>
                  {job.category && (
                    <Badge variant="outline" className="text-xs">
                      {job.category}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
                <Badge className={`${getTypeColor(job.type)} border-0 px-3 py-1 sm:px-4 sm:py-2 font-semibold text-xs sm:text-sm`}>
                  {job.type}
                </Badge>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3 text-slate-600 dark:text-slate-400">
                <div className="p-1 sm:p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-medium text-xs sm:text-base">{job.location}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-slate-600 dark:text-slate-400">
                <div className="p-1 sm:p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <DollarSign className="h-4 w-4" />
                </div>
                <span className="font-medium text-xs sm:text-base">{job.salary}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-slate-600 dark:text-slate-400">
                <div className="p-1 sm:p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-medium text-xs sm:text-base">{new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-2 sm:mb-4 text-xs sm:text-base">{job.description}</p>

            {job.tags && job.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {job.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px] sm:text-xs">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 4 && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    +{job.tags.length - 4} more
                    
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
})
