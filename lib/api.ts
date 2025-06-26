import type { Job } from "@/types/job"

interface ApiResponse {
  jobs: Job[]
  source: "remotive" | "api_error" | "api_empty"
  message: string
  error?: string
}

export async function fetchRemotiveJobs(): Promise<{ jobs: Job[]; source: string; message: string }> {
  try {
    console.log("Client: Fetching jobs from API route...")

    const isServer = typeof window === "undefined"
    let baseUrl = ""
    if (isServer) {
      if (process.env.NEXT_PUBLIC_SITE_URL) {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL
      } else if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`
      } else {
        baseUrl = "http://localhost:3000"
      }
    }
    const response = await fetch(`${baseUrl}/api/jobs`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      // Add timeout for faster failure
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    console.log(`Client: Received ${data.jobs.length} jobs from ${data.source}`)

    return {
      jobs: data.jobs,
      source: data.source,
      message: data.message,
    }
  } catch (error) {
    console.error("Client: Error fetching jobs:", error)
    throw error
  }
}


let jobsCache: { data: Job[]; source: string; message: string; timestamp: number } | null = null
const CACHE_DURATION = 3 * 60 * 1000 

export async function getCachedRemotiveJobs(): Promise<{ jobs: Job[]; source: string; message: string }> {
  const now = Date.now()

  if (jobsCache && now - jobsCache.timestamp < CACHE_DURATION) {
    console.log("Client: Using cached job data")
    return {
      jobs: jobsCache.data,
      source: jobsCache.source,
      message: jobsCache.message,
    }
  }

  console.log("Client: Fetching fresh job data")
  const result = await fetchRemotiveJobs()
  jobsCache = {
    data: result.jobs,
    source: result.source,
    message: result.message,
    timestamp: now,
  }

  return result
}
