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
    tech: ["python", "beautifulsoup", "playwright", "airflow"],
    description:
      "Scheduled Python scrapers pull offers on a cadence: BeautifulSoup + httpx for static pages, and Playwright for JavaScript-heavy ones. Apache Airflow orchestrates the runs, and raw artifacts (HTML, PDF, image) are snapshotted to Supabase Storage for provenance and re-processing.",
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
      "An LLM (Claude) with structured output turns unstructured offer text and images into clean, comparable facts — capturing constraints like “desserts only” or “Tuesdays only” into one standard schema. A human reviews extractions until precision is proven, then rows are written into Supabase using the service-role key.",
  },
  {
    id: "supabase",
    step: 4,
    title: "Supabase",
    subtitle: "Backend, data & instant API",
    status: "planned",
    overview: "supabase",
    tech: ["supabase", "postgresql"],
    description:
      "Supabase is the entire backend — managed Postgres (with PostGIS for “near me”) plus auto-generated REST/Realtime APIs, Row-Level Security, Auth and Storage. It replaces a hand-written CRUD service: scrapers write with the service-role key, and the app reads with the public anon key behind read-only RLS.",
  },
  {
    id: "frontend",
    step: 5,
    title: "Frontend",
    subtitle: "What you're looking at",
    status: "live",
    overview: "nextjs",
    tech: ["nextjs", "react", "typescript", "tailwind", "vercel"],
    description:
      "The Next.js app (React + TypeScript + Tailwind) on Vercel renders browse, search and offer-detail — server-rendered for SEO. It queries Supabase directly with supabase-js; today it transparently falls back to a typed mock layer until the Supabase keys are set.",
  },
  {
    id: "users",
    step: 6,
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
  { label: "Backend & Data", items: ["supabase", "postgresql"] },
  {
    label: "Ingestion & AI",
    items: ["python", "beautifulsoup", "playwright", "airflow", "pandas", "anthropic"],
  },
  { label: "DevOps", items: ["githubactions"] },
];
