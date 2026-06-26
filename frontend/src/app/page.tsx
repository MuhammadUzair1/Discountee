import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { CardSelector } from "@/components/card-selector";
import { OfferCard } from "@/components/offer-card";
import { getFeaturedOffers } from "@/lib/api";
import { banks, offers } from "@/lib/data";

const STEPS = [
  {
    icon: CreditCard,
    title: "Pick your card",
    body: "Choose your bank, card network and tier — debit, gold, platinum, signature and more.",
  },
  {
    icon: ListChecks,
    title: "See matching offers",
    body: "Instantly compare every discount that actually applies to the card in your wallet.",
  },
  {
    icon: Wallet,
    title: "Save at checkout",
    body: "Show your card at the merchant and enjoy the deal — no codes, no hassle.",
  },
];

export default async function Home() {
  const featured = await getFeaturedOffers(6);
  const cityCount = new Set(offers.flatMap((o) => o.cities)).size;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-soft to-background" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-surface px-3 py-1 text-xs font-medium text-brand-strong">
              <Sparkles className="h-3.5 w-3.5" />
              Pakistan&apos;s bank-discount finder
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Find every discount your bank card unlocks.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted">
              Bank offers are scattered across dozens of pages. Discountee brings
              them into one place — just pick your card and see where you save.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <CardSelector banks={banks} />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <Stat value={`${offers.length}`} label="curated offers" />
              <span className="hidden h-4 w-px bg-border sm:block" />
              <Stat value={`${banks.length}`} label="banks" />
              <span className="hidden h-4 w-px bg-border sm:block" />
              <Stat value={`${cityCount}`} label="cities" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                <step.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
                Step {i + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured offers */}
      <section className="border-t border-border bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Top discounts right now
              </h2>
              <p className="mt-1.5 text-muted">
                The biggest savings across Pakistani banks this week.
              </p>
            </div>
            <Link
              href="/offers"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-strong sm:inline-flex"
            >
              Browse all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link
              href="/offers"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
            >
              Browse all offers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-brand/15 bg-brand-soft px-6 py-6 sm:flex-row sm:items-center sm:gap-4">
          <ShieldCheck className="h-7 w-7 shrink-0 text-brand-strong" />
          <p className="text-sm text-brand-strong">
            <span className="font-semibold">Trust you can see.</span> Every offer
            shows when it was last verified and links back to its source — so you
            never travel for a deal that no longer exists.
          </p>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="text-base font-bold text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  );
}
