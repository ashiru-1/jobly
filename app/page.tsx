import type { Job } from "@/types/job"
import { Suspense } from "react"
import JobBoardClient from "@/components/job-board-client"
import jobsData from "@/data/jobs.json"

export default function JobBoard() {
  return (
    <Suspense fallback={<div>Loading jobs...</div>}>
      <JobBoardClient jobs={jobsData.jobs as Job[]} />
    </Suspense>
  )
}
