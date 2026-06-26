// Discountee system architecture — data that drives the /architecture page.
// `tech` values are keys into the TECH registry in components/architecture/tech-icon.tsx.

export type StageStatus = "live" | "planned";

export interface Stage {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  status: StageStatus;
  /** Single representative tech key for the compact pipeline overview. */
  overview: string;
  /** Tech shown as chips in the detailed stage card. */
  tech: string[];
  description: string;
}

export const STAGES: Stage[] = [
  {
    id: "sources",
    step: 1,
    title: "Sources",
    subtitle: "Where offers live today",
    status: "planned",
    overview: "banksite",
    tech: ["banksite", "pdf", "image"],
    description:
      "Bank discount offers are scattered across dozens of bank websites, buried in PDFs, and even baked into promotional images. This messy, inconsistent spread is exactly the problem Discountee exists to solve — and the raw input to the pipeline.",
  },
  {
    id: "ingestion",
    step: 2,
    title: "Scraping & Ingestion",
    subtitle: "Collect on a schedule",
    status: "planned",
    overview: "airflow",
    tech: ["beautifulsoup", "playwright", "airflow", "s3"],
    description:
      "Scheduled scrapers pull offers on a cadence: BeautifulSoup + httpx for static pages, and Playwright for JavaScript-heavy ones (often capturing the underlying JSON API directly). Apache Airflow orchestrates the runs, and every raw artifact — HTML, PDF, image — is snapshotted to Amazon S3 for provenance and re-processing.",
  },
  {
    id: "normalization",
    step: 3,
    title: "Normalization",
    subtitle: "Messy text → clean facts",
    status: "planned",
    overview: "anthropic",
    tech: ["python", "pandas", "anthropic", "review"],
    description:
      "An LLM (Claude) with structured output turns unstructured offer text and images into clean, comparable facts — capturing constraints like “desserts only” or “Tuesdays only” into one standard schema, in our own words (facts, not copied marketing). A human reviews extractions until precision is proven.",
  },
  {
    id: "storage",
    step: 4,
    title: "Storage",
    subtitle: "The serving database",
    status: "planned",
    overview: "postgresql",
    tech: ["postgresql", "redis"],
    description:
      "Normalized offers land in PostgreSQL, with the PostGIS extension powering “best deal near me” geo-queries. Redis caches hot searches. Every offer carries its source, a confidence score, and a “last verified” timestamp so the front end can show how fresh each deal is.",
  },
  {
    id: "api",
    step: 5,
    title: "API",
    subtitle: "Typed, versioned endpoints",
    status: "planned",
    overview: "fastapi",
    tech: ["fastapi", "python", "docker", "aws"],
    description:
      "A FastAPI service exposes typed, versioned endpoints (/offers, /search, /banks). It runs in a Docker container on AWS and is fully decoupled from ingestion — they communicate only through the database, so a scraper breaking never affects users.",
  },
  {
    id: "frontend",
    step: 6,
    title: "Frontend",
    subtitle: "What you're looking at",
    status: "live",
    overview: "nextjs",
    tech: ["nextjs", "react", "typescript", "tailwind", "vercel"],
    description:
      "The Next.js app (React + TypeScript + Tailwind) on Vercel renders the browse, search and offer-detail experience — server-rendered for SEO. Today it reads a typed mock data-layer; switching to the live FastAPI is a single-file change because the shapes are identical.",
  },
  {
    id: "users",
    step: 7,
    title: "Shoppers",
    subtitle: "The payoff",
    status: "live",
    overview: "user",
    tech: ["user"],
    description:
      "People pick their bank, card network and tier and instantly see where they save. Crowdsourced “did this work?” feedback flows back into the dataset, keeping offers fresh — the freshest signal of all comes from real users.",
  },
];

export interface TechGroup {
  label: string;
  items: string[];
}

export const TECH_STACK: TechGroup[] = [
  {
    label: "Frontend",
    items: ["nextjs", "react", "typescript", "tailwind", "vercel"],
  },
  { label: "Backend", items: ["python", "fastapi", "docker", "aws"] },
  { label: "Data & Storage", items: ["postgresql", "redis", "pandas", "s3"] },
  {
    label: "Ingestion & AI",
    items: ["beautifulsoup", "playwright", "airflow", "anthropic"],
  },
  { label: "DevOps", items: ["githubactions"] },
];
