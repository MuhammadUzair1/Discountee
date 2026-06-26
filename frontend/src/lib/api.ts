// Data-access layer.
//
// Today this resolves against local mock data (lib/data.ts). When the FastAPI
// backend is ready, swap the bodies for `fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/...`)`
// calls — the return types stay identical, so no component has to change.

import { banks, bankById, cities, offers } from "./data";
import type { Bank, Offer, OfferFilters } from "./types";

export async function getBanks(): Promise<Bank[]> {
  return banks;
}

export async function getBank(id: string): Promise<Bank | undefined> {
  return bankById(id);
}

export async function getCities(): Promise<string[]> {
  return cities;
}

export async function getOffers(filters: OfferFilters = {}): Promise<Offer[]> {
  return offers.filter((offer) => matchesFilters(offer, filters));
}

export async function getOffer(id: string): Promise<Offer | undefined> {
  return offers.find((o) => o.id === id);
}

export async function getFeaturedOffers(limit = 6): Promise<Offer[]> {
  return [...offers]
    .filter((o) => o.status === "active")
    .sort((a, b) => b.discountValue - a.discountValue)
    .slice(0, limit);
}

/** Pure predicate, exported so the client explorer can filter without a round-trip. */
export function matchesFilters(offer: Offer, f: OfferFilters): boolean {
  if (f.bankId && offer.bankId !== f.bankId) return false;
  if (f.network && !offer.eligibleNetworks.includes(f.network)) return false;
  if (f.tier && !offer.eligibleTiers.includes(f.tier)) return false;
  if (f.city && !offer.cities.includes(f.city)) return false;
  if (f.vertical && offer.merchant.vertical !== f.vertical) return false;
  if (f.search) {
    const q = f.search.toLowerCase();
    const haystack =
      `${offer.merchant.name} ${offer.merchant.category} ${offer.title}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}
