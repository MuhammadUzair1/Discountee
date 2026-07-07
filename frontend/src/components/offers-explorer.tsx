"use client";

import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import type {
  Bank,
  CardNetwork,
  CardTier,
  Offer,
  OfferFilters,
} from "@/lib/types";
import { matchesFilters } from "@/lib/offer-filters";
import { ALL_NETWORKS, ALL_TIERS } from "@/lib/utils";
import { OfferCard } from "./offer-card";

type SortKey = "best" | "recent" | "expiring";

const selectClass =
  "appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

function score(o: Offer): number {
  switch (o.discountType) {
    case "percentage":
    case "cashback":
      return o.discountValue;
    case "bogo":
      return 50;
    case "flat":
      return Math.min(o.discountValue / 100, 40);
  }
}

export function OffersExplorer({
  offers,
  banks,
  cities,
  initial = {},
}: {
  offers: Offer[];
  banks: Bank[];
  cities: string[];
  initial?: OfferFilters;
}) {
  const [search, setSearch] = useState(initial.search ?? "");
  const [bankId, setBankId] = useState(initial.bankId ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [network, setNetwork] = useState<string>(initial.network ?? "");
  const [tier, setTier] = useState<string>(initial.tier ?? "");
  const [sort, setSort] = useState<SortKey>("best");

  const hasFilters = Boolean(
    search || bankId || city || network || tier,
  );

  const results = useMemo(() => {
    const filters: OfferFilters = {
      search: search || undefined,
      bankId: bankId || undefined,
      city: city || undefined,
      network: (network || undefined) as CardNetwork | undefined,
      tier: (tier || undefined) as CardTier | undefined,
    };
    const list = offers.filter((o) => matchesFilters(o, filters));
    list.sort((a, b) => {
      if (sort === "best") return score(b) - score(a);
      if (sort === "recent")
        return +new Date(b.lastVerified) - +new Date(a.lastVerified);
      return +new Date(a.validTo) - +new Date(b.validTo);
    });
    return list;
  }, [offers, search, bankId, city, network, tier, sort]);

  function clearAll() {
    setSearch("");
    setBankId("");
    setCity("");
    setNetwork("");
    setTier("");
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <input
          type="search"
          placeholder="Search by restaurant or cuisine…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted" />
          <select
            className={selectClass}
            value={bankId}
            onChange={(e) => setBankId(e.target.value)}
            aria-label="Bank"
          >
            <option value="">All banks</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            aria-label="Network"
          >
            <option value="">All networks</option>
            {ALL_NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            aria-label="Tier"
          >
            <option value="">All tiers</option>
            {ALL_TIERS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort"
          >
            <option value="best">Best discount</option>
            <option value="recent">Recently verified</option>
            <option value="expiring">Expiring soon</option>
          </select>
          {hasFilters ? (
            <button
              onClick={clearAll}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-brand hover:underline"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">
        <span className="font-semibold text-foreground">{results.length}</span>{" "}
        {results.length === 1 ? "offer" : "offers"} found
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-muted" />
          <p className="mt-3 font-medium text-foreground">No offers match these filters</p>
          <p className="mt-1 text-sm text-muted">
            Try clearing a filter or widening your search.
          </p>
          {hasFilters ? (
            <button
              onClick={clearAll}
              className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-strong"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
