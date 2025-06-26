export function JobCardSkeleton() {
  return (
    <div className="group border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl animate-pulse">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg mb-2 w-3/4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
          </div>
        </div>
        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
      </div>
    </div>
  )
}

export function JobListingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}

// New component for initial loading state
export function InitialJobsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-in fade-in-0 slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
          <JobCardSkeleton />
        </div>
      ))}
    </div>
  )
}
