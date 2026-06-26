import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { BankChip } from "@/components/bank-chip";
import { ReportOfferButton } from "@/components/report-offer-button";
import { getBank, getOffer } from "@/lib/api";
import { daysLabel, daysSince, discountHeadline, formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) return { title: "Offer not found — Discountee" };
  return {
    title: `${offer.title} — Discountee`,
    description: offer.description,
  };
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound();

  const bank = await getBank(offer.bankId);
  const sinceDays = daysSince(offer.lastVerified);
  const stale = sinceDays > 30;
  const verified = offer.status === "active" && !stale;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link
        href="/offers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to offers
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <BankChip bank={bank} size="lg" />
                <div>
                  <p className="text-sm font-medium text-muted">{bank?.name}</p>
                  <h1 className="text-xl font-bold tracking-tight text-foreground">
                    {offer.merchant.name}
                  </h1>
                  <p className="text-sm text-muted">{offer.merchant.category}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-xl bg-accent-soft px-3 py-1.5 text-base font-bold text-accent">
                {discountHeadline(offer)}
              </span>
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-foreground">
              {offer.description}
            </p>

            {offer.scopeNote ? (
              <div className="mt-4 rounded-lg bg-brand-soft px-3 py-2 text-sm font-medium text-brand-strong">
                {offer.scopeNote}
              </div>
            ) : null}
            {offer.exclusions ? (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{offer.exclusions}</span>
              </div>
            ) : null}

            <hr className="my-6 border-border" />

            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Offer details
            </h2>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Applicable days">
                {daysLabel(offer.applicableDays)}
              </Detail>
              {offer.timeWindow ? (
                <Detail icon={Clock} label="Time">
                  {offer.timeWindow}
                </Detail>
              ) : null}
              <Detail icon={MapPin} label="Cities">
                {offer.cities.join(", ")}
              </Detail>
              <Detail icon={CalendarDays} label="Valid until">
                {formatDate(offer.validTo)}
              </Detail>
              {offer.minSpend ? (
                <Detail icon={Receipt} label="Minimum spend">
                  Rs {offer.minSpend.toLocaleString()}
                </Detail>
              ) : null}
              {offer.maxDiscountCap ? (
                <Detail icon={Wallet} label="Maximum discount">
                  Rs {offer.maxDiscountCap.toLocaleString()}
                </Detail>
              ) : null}
            </dl>

            <hr className="my-6 border-border" />

            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Card eligibility
            </h2>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs text-muted">Networks</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {offer.eligibleNetworks.map((n) => (
                    <span
                      key={n}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted">Tiers</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {offer.eligibleTiers.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            {verified ? (
              <div className="flex items-center gap-2 rounded-lg bg-brand-soft px-3 py-2 text-sm font-medium text-brand-strong">
                <ShieldCheck className="h-4 w-4" />
                Verified{" "}
                {sinceDays === 0
                  ? "today"
                  : `${sinceDays} day${sinceDays === 1 ? "" : "s"} ago`}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent">
                <AlertTriangle className="h-4 w-4" />
                {offer.status === "unverified"
                  ? "Not yet verified"
                  : "Needs re-checking"}
              </div>
            )}

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Last verified</dt>
                <dd className="font-medium text-foreground">
                  {formatDate(offer.lastVerified)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Source</dt>
                <dd>
                  <a
                    href={offer.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand hover:text-brand-strong"
                  >
                    Bank page
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Terms</dt>
                <dd>
                  <a
                    href={offer.termsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-brand hover:text-brand-strong"
                  >
                    Full T&amp;Cs
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-4 rounded-lg bg-background px-3 py-2 text-xs leading-relaxed text-muted">
              The bank&apos;s official terms are always authoritative. Discountee
              shows a normalized, best-effort summary.
            </p>

            <div className="mt-4">
              <ReportOfferButton />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
      <div>
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="text-sm font-medium text-foreground">{children}</dd>
      </div>
    </div>
  );
}
