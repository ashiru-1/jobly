# Jobly

Jobly is a modern, mobile-friendly job board application that lets users browse, search, and filter a large set of remote job opportunities—all powered by local static data (no backend or external API required). It features a beautiful, responsive UI and powerful filtering tools for a seamless experience.

## Features
- Browse and search 50+ remote jobs (easily expandable)
- Filter by job type (Full-time, Part-time, Contract, Internship), category, and keywords
- Responsive design
- Job details modal with requirements and benefits
- Light/dark theme toggle

## How It Works
- All job data is stored in a local JSON file (`data/jobs.json`).
- No backend, no API calls—everything is static and fast.
- Easily add, edit, or remove jobs by editing the JSON file.

## Getting Started

1. **Install dependencies:**
   ```bash
   yarn install
   ```
2. **Run the development server:**
   ```bash
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router, Static Site Generation)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built by Cypher**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## Customizing Jobs
- Edit `data/jobs.json` to add, remove, or update job listings.
- No code changes needed—just update the JSON and restart the dev server if running locally.

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

## Deploy
The easiest way to deploy your static Next.js app is with [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
