import type { Offer, OfferFilters } from "./types";

/** Pure predicate — shared by the data layer and the client-side explorer. */
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
