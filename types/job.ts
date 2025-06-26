export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Full-time" | "Part-time" | "Contract" | "Remote"
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  logo?: string
  url?: string
  category?: string
  tags?: string[]
}

export interface JobFilters {
  search: string
  types: string[]
  categories: string[]
}

// Remotive API response types (used in jobly)
export interface RemotiveJob {
  id: number
  url: string
  title: string
  company_name: string
  company_logo: string
  category: string
  tags: string[]
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary: string
  description: string
}

export interface RemotiveApiResponse {
  "0": RemotiveJob[]
}
