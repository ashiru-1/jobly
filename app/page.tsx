import type { Job } from "@/types/job"
import JobBoardClient from "@/components/job-board-client"


async function fetchJobsServer(): Promise<Job[]> {
  let baseUrl = "";
  if (typeof window === "undefined") {
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      baseUrl = "http://localhost:3000";
    }
  }
  const url = typeof window === "undefined" ? `${baseUrl}/api/jobs` : "/api/jobs";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();
  return data.jobs || [];
}

export default async function JobBoard() {
  const jobs = await fetchJobsServer()
  return <JobBoardClient jobs={jobs} />
}
