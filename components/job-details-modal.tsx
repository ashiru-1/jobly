"use client"

import type { Job } from "@/types/job"
import { MapPin, Clock, DollarSign, Building2, Star, CheckCircle, ExternalLink, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface JobDetailsModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  if (!isOpen || !job) return null;

  const [showFullDescription, setShowFullDescription] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const DESCRIPTION_PREVIEW_LENGTH = 300
  const isLongDescription = job.description.length > DESCRIPTION_PREVIEW_LENGTH
  const descriptionToShow = showFullDescription || !isLongDescription
    ? job.description
    : job.description.slice(0, DESCRIPTION_PREVIEW_LENGTH) + "..."

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

  const handleApplyClick = () => {
    if (job.url) {
      window.open(job.url, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-full sm:max-w-4xl sm:w-[90vw] max-w-full p-2 sm:p-8 max-h-[90vh] overflow-y-auto border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
        <DialogHeader className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:space-x-6 flex-1 w-full">
              {/* Logo: centered on mobile, left on desktop */}
              <div className="relative mb-4 sm:mb-0 w-full sm:w-auto flex justify-center sm:justify-start">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-30"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                  {job.logo && !logoLoaded && (
                    <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl" />
                  )}
                  {job.logo ? (
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className={`w-12 h-12 sm:w-16 sm:h-16 object-contain ${logoLoaded ? '' : 'hidden'}`}
                      onLoad={() => setLogoLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        target.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <Building2 className={`w-8 h-8 sm:w-10 sm:h-10 text-slate-600 dark:text-slate-300 ${job.logo ? "hidden" : ""}`} />
                </div>
              </div>
              {/* Info: centered on mobile, left on desktop, always row */}
              <div className="flex-1 w-full">
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center sm:text-left">
                  {job.title}
                </DialogTitle>
                <div className="flex flex-row flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-semibold text-base sm:text-lg">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                  <Badge className={`${getTypeColor(job.type)} border-0 px-3 py-1 sm:px-4 sm:py-2 font-semibold text-xs sm:text-base`}>{job.type}</Badge>
                  {job.category && (
                    <Badge variant="outline" className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-base">
                      {job.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Salary and Date */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Salary Range</p>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">{job.salary}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-base">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Job Description */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Job Description
            </h3>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">
              {descriptionToShow}
              {isLongDescription && (
                <button
                  className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline focus:outline-none"
                  onClick={() => setShowFullDescription((v) => !v)}
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Requirements */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
              Requirements
            </h3>
            {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 text-base">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="leading-relaxed">{requirement}</li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-500 dark:text-slate-400 italic text-center py-4">No specific requirements listed.</div>
            )}
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

          {/* Benefits */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-green-500" />
              Benefits & Perks
            </h3>
            <div className="grid gap-4">
              {job.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            <Button
              onClick={handleApplyClick}
              className="w-full sm:flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:scale-105"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Apply on Remotive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
