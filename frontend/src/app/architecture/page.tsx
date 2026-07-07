import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import {
  ArchitectureFlow,
  PipelineOverview,
  TechStackGrid,
} from "@/components/architecture/architecture-diagram";

export const metadata = {
  title: "Architecture & how it works — Discountee",
  description:
    "How Discountee works end-to-end: scraping and ingestion, LLM normalization, storage, API and the Next.js front end — and the tech stack behind it.",
};

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand-strong">
          <Layers className="h-3.5 w-3.5" />
          Architecture &amp; how it works
        </span>
        <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          From scattered bank pages to a deal in your hand
        </h1>
        <p className="mt-4 text-balance text-lg text-muted">
          Discountee is a data pipeline with a friendly face. Offers are scraped,
          cleaned by an LLM, and stored in Supabase — which the app reads directly.
          Each step uses the right tool for the job.
        </p>
        <div className="mt-5 flex items-center justify-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-semibold text-brand-strong">
              Live
            </span>
            shipped today
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full bg-accent-soft px-2 py-0.5 font-semibold text-accent">
              Planned
            </span>
            on the roadmap
          </span>
        </div>
      </header>

      {/* At a glance */}
      <section className="mt-12">
        <div className="rounded-3xl border border-border bg-gradient-to-b from-brand-soft/60 to-surface p-5 shadow-sm sm:p-8">
          <p className="mb-5 text-center text-sm font-semibold uppercase tracking-wide text-muted">
            The pipeline at a glance
          </p>
          <PipelineOverview />
        </div>
      </section>

      {/* Built with */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Built with
        </h2>
        <p className="mt-1.5 text-muted">
          The tools and services that power Discountee.
        </p>
        <div className="mt-6">
          <TechStackGrid />
        </div>
      </section>

      {/* Step by step */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          How it works, step by step
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          Follow a bank offer all the way from a scattered web page to the card in
          a shopper&apos;s wallet.
        </p>
        <div className="mt-10">
          <ArchitectureFlow />
        </div>
      </section>

      {/* Closing note */}
      <section className="mt-16">
        <div className="rounded-2xl border border-brand/15 bg-brand-soft px-6 py-6 text-sm leading-relaxed text-brand-strong">
          <span className="font-semibold">Decoupled by design.</span> Ingestion and
          the app talk only through Supabase, so a broken scraper never takes the
          site down. The front end is live now; the ingestion, LLM and Supabase data
          layers are built out in phases — see the roadmap in the project docs.
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/offers"
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-strong"
          >
            See it in action — browse offers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
