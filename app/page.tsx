import type { Job } from "@/types/job"
import JobBoardClient from "@/components/job-board-client"
import jobsData from "@/data/jobs.json"

export default function JobBoard() {
  return <JobBoardClient jobs={jobsData.jobs as Job[]} />
}
