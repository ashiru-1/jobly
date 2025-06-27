import { NextResponse } from "next/server"
import type { Job } from "@/types/job"

// Transform Remotive job to our Job interface
function transformRemotiveJob(remotiveJob: any): Job {
  const description = remotiveJob.description || ""
  const cleanDescription = description.replace(/<[^>]*>/g, "")

  const requirementsMatch = description.match(
    /(?:requirements?|qualifications?|skills?)[:\s]*([^]*?)(?=\n\n|benefits?|responsibilities?|$)/i,
  )
  let requirements: string[] = []
  if (requirementsMatch) {
    requirements = requirementsMatch[1]
      .replace(/<[^>]*>/g, "")
      .split(/[•\-*\n]/)
      .map((req: string) => req.trim())
      .filter((req: string) => {
        // At least 6 words, ends with a period, not starting or ending with 'and', 'or', 'but', and not too short or too long
        if (!req || req.length < 10 || req.length > 200) return false
        if (/^(and|or|but)\b/i.test(req)) return false
        if (req.split(/\s+/).length < 6) return false
        if (!req.endsWith('.')) return false
        if (/(and|or|but)\.?$/i.test(req)) return false
        return true
      })
      .slice(0, 6)
  }
  if (!requirements || requirements.length === 0) {
    requirements = [
      "Experience in relevant field.",
      "Strong communication skills.",
      "Ability to work independently.",
      "Problem-solving mindset."
    ]
  }

  const benefitsMatch = description.match(
    /(?:benefits?|perks?|we offer)[:\s]*([^]*?)(?=\n\n|requirements?|responsibilities?|$)/i,
  )
  let benefits: string[] = []
  if (benefitsMatch) {
    benefits = benefitsMatch[1]
      .replace(/<[^>]*>/g, "")
      .split(/[•\-*\n]/)
      .map((benefit: string) => benefit.trim())
      .filter((benefit: string) => {
        if (!benefit || benefit.length < 10 || benefit.length > 200) return false
        if (benefit.split(/\s+/).length < 6) return false
        if (!benefit.endsWith('.')) return false
        if (/(and|or|but)\.?$/i.test(benefit)) return false
        if (/salary|applicants only|can be found here|minimum|maximum|compensation|pay|wage|monthly|hourly|USD|\$[0-9]/i.test(benefit)) return false
        return true
      })
      .slice(0, 6)
  }
  if (!benefits || benefits.length === 0) {
    benefits = [
      "Competitive salary.",
      "Remote work flexibility.",
      "Health insurance.",
      "Professional development opportunities."
    ]
  }

  return {
    id: remotiveJob.id?.toString() || Math.random().toString(),
    title: remotiveJob.title || "Remote Position",
    company: remotiveJob.company_name || "Remote Company",
    location: remotiveJob.candidate_required_location || "Remote",
    type: remotiveJob.job_type || "Other",
    salary: remotiveJob.salary || "Competitive salary",
    description: cleanDescription,
    requirements,
    benefits,
    postedDate: remotiveJob.publication_date || new Date().toISOString().split("T")[0],
    logo: remotiveJob.company_logo,
    url: remotiveJob.url,
    category: remotiveJob.category || "Other",
    tags: remotiveJob.tags || [],
  }
}

// Simple in-memory cache for server-side API
let jobsCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (jobsCache && now - jobsCache.timestamp < CACHE_DURATION) {
      console.log("API Route: Using cached jobs data");
      return NextResponse.json(jobsCache.data);
    }
    console.log("API Route: Fetching jobs from Remotive...")

    // Fetch from Remotive API with increased limit
    const response = await fetch("https://remotive.com/api/remote-jobs?limit=200", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "jobly/1.0",
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    console.log("API Route: Remotive API status:", response.status);

    let data;
    try {
      data = await response.json();
      console.log("API Route: Remotive API response data:", JSON.stringify(data).slice(0, 500)); // Log first 500 chars
    } catch (jsonErr) {
      const text = await response.text();
      console.error("API Route: Failed to parse JSON from Remotive. Raw response:", text.slice(0, 500));
      throw new Error("Failed to parse JSON from Remotive API");
    }

    if (!response.ok) {
      console.error("API Route: Remotive API returned non-OK status", response.status, data);
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Handle different possible response structures
    let jobs = []
    if (Array.isArray(data)) {
      jobs = data
    } else if (data.jobs && Array.isArray(data.jobs)) {
      jobs = data.jobs
    } else if (data["0"] && Array.isArray(data["0"])) {
      jobs = data["0"]
    } else if (data.data && Array.isArray(data.data)) {
      jobs = data.data
    } else {
      console.warn("API Route: Unexpected response structure", data)
      return NextResponse.json({
        jobs: [],
        source: "api_error",
        message: "Unable to parse job data from API",
        error: "Unexpected response structure",
      })
    }

    if (jobs.length === 0) {
      console.log("API Route: No jobs returned from API")
      return NextResponse.json({
        jobs: [],
        source: "api_empty",
        message: "No jobs available from API at this time",
        error: "Empty response from job API",
      })
    }

    const transformedJobs = jobs.slice(0, 200).map(transformRemotiveJob)
    console.log(`API Route: Successfully transformed ${transformedJobs.length} jobs`)

    jobsCache = { data: { jobs: transformedJobs }, timestamp: now };

    return NextResponse.json({
      jobs: transformedJobs,
      source: "remotive",
      message: `${transformedJobs.length} live remote jobs from Remotive`,
    })
  } catch (error) {
    console.error("API Route: Error fetching from Remotive:", error)

    return NextResponse.json({
      jobs: [],
      source: "api_error",
      message: "Unable to fetch jobs at this time",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
