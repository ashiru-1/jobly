"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  onRetry: () => void
  message?: string
}

export function ErrorState({ onRetry, message = "Failed to load jobs" }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 p-6 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
        {message}. Please check your internet connection and try again.
      </p>
      <Button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  )
}
