import type { Job } from "@/types/job"
import JobBoardClient from "@/components/job-board-client"


async function fetchJobsServer(): Promise<Job[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/jobs`, {
    cache: "no-store"
  })
  if (!res.ok) throw new Error("Failed to fetch jobs")
  const data = await res.json()
  return data.jobs || []
}

export default async function JobBoard() {
  const jobs = await fetchJobsServer()
  return <JobBoardClient jobs={jobs} />
}
