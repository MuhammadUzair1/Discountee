import { Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { STAGES, TECH_STACK, type Stage, type StageStatus } from "@/lib/architecture";
import { TechIcon, techName } from "./tech-icon";

function StatusBadge({ status }: { status: StageStatus }) {
  return status === "live" ? (
    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-strong">
      Live
    </span>
  ) : (
    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
      Planned
    </span>
  );
}

function TechChip({ tech }: { tech: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium text-foreground">
      <TechIcon tech={tech} className="h-5 w-5" />
      {techName(tech)}
    </span>
  );
}

function ConnectorY() {
  return (
    <div className="flex flex-col items-center py-1.5" aria-hidden>
      <div className="flow-y h-9 w-[3px] rounded-full opacity-80" />
      <ChevronDown className="-mt-1.5 h-5 w-5 text-brand" />
    </div>
  );
}

function ConnectorX() {
  return (
    <div className="mt-7 flex items-center" aria-hidden>
      <div className="flow-x h-[3px] w-8 rounded-full opacity-80" />
      <ChevronRight className="-ml-1.5 h-5 w-5 text-brand" />
    </div>
  );
}

/** Compact left-to-right pipeline — the "architecture at a glance" strip. */
export function PipelineOverview() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-start justify-center gap-1 px-2">
        {STAGES.map((stage, i) => (
          <Fragment key={stage.id}>
            <div className="flex w-24 flex-col items-center gap-2 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
                <TechIcon tech={stage.overview} className="h-7 w-7" />
              </div>
              <span className="text-xs font-medium leading-tight text-foreground">
                {stage.title}
              </span>
            </div>
            {i < STAGES.length - 1 ? <ConnectorX /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function StageCard({ stage }: { stage: Stage }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {stage.step}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">
              {stage.title}
            </h3>
            <StatusBadge status={stage.status} />
          </div>
          <p className="text-sm text-muted">{stage.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {stage.tech.map((t) => (
          <TechChip key={t} tech={t} />
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        {stage.description}
      </p>
    </div>
  );
}

/** Detailed top-to-bottom flow with "how it works" descriptions. */
export function ArchitectureFlow() {
  return (
    <div className="mx-auto max-w-2xl">
      {STAGES.map((stage, i) => (
        <div key={stage.id}>
          <StageCard stage={stage} />
          {i < STAGES.length - 1 ? <ConnectorY /> : null}
        </div>
      ))}
    </div>
  );
}

export function TechStackGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {TECH_STACK.map((group) => (
        <div
          key={group.label}
          className="rounded-2xl border border-border bg-surface p-5 shadow-sm"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {group.label}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.items.map((t) => (
              <TechChip key={t} tech={t} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
