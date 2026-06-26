import { OffersExplorer } from "@/components/offers-explorer";
import { getBanks, getCities, getOffers } from "@/lib/api";
import type { CardNetwork, CardTier, OfferFilters } from "@/lib/types";

export const metadata = {
  title: "Browse discounts — Discountee",
};

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const [offers, banks, cities] = await Promise.all([
    getOffers(),
    getBanks(),
    getCities(),
  ]);

  const initial: OfferFilters = {
    bankId: sp.bank,
    network: sp.network as CardNetwork | undefined,
    tier: sp.tier as CardTier | undefined,
    city: sp.city,
    search: sp.q,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Browse discounts
        </h1>
        <p className="mt-1.5 text-muted">
          Filter by bank, card and city to find the offers that apply to you.
        </p>
      </header>

      <OffersExplorer
        offers={offers}
        banks={banks}
        cities={cities}
        initial={initial}
      />
    </div>
  );
}
