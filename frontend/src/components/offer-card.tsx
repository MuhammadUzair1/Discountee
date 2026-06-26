import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { Offer } from "@/lib/types";
import { bankById } from "@/lib/data";
import { daysLabel, daysSince, discountHeadline, formatDate } from "@/lib/utils";
import { BankChip } from "./bank-chip";

export function OfferCard({ offer }: { offer: Offer }) {
  const bank = bankById(offer.bankId);
  const stale = daysSince(offer.lastVerified) > 30;
  const verified = offer.status === "active" && !stale;
  const sinceDays = daysSince(offer.lastVerified);

  return (
    <Link
      href={`/offers/${offer.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <BankChip bank={bank} />
          <span className="text-sm font-medium text-muted">{bank?.name}</span>
        </div>
        <span className="shrink-0 rounded-lg bg-accent-soft px-2.5 py-1 text-sm font-bold text-accent">
          {discountHeadline(offer)}
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground transition-colors group-hover:text-brand-strong">
        {offer.merchant.name}
      </h3>
      <p className="text-sm text-muted">{offer.merchant.category}</p>

      {offer.scopeNote ? (
        <p className="mt-2 inline-flex w-fit rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-strong">
          {offer.scopeNote}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {offer.cities.slice(0, 2).join(", ")}
          {offer.cities.length > 2 ? ` +${offer.cities.length - 2}` : ""}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {daysLabel(offer.applicableDays)}
        </span>
        {offer.timeWindow ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {offer.timeWindow}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {offer.eligibleNetworks.map((n) => (
          <span
            key={n}
            className="rounded border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted"
          >
            {n}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
        {verified ? (
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified {sinceDays === 0 ? "today" : `${sinceDays}d ago`}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            <AlertTriangle className="h-3.5 w-3.5" />
            {offer.status === "unverified" ? "Unverified" : "Needs re-check"}
          </span>
        )}
        <span className="text-muted">Until {formatDate(offer.validTo)}</span>
      </div>
    </Link>
  );
}
