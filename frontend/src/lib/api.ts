// Data-access layer.
//
// Reads from Supabase (@supabase/supabase-js) when env vars are configured;
// otherwise falls back to local mock data so the app runs with zero setup.
// Return types are identical either way, so components never change.

import { supabase } from "./supabase";
import { banks as mockBanks, offers as mockOffers } from "./data";
import { matchesFilters } from "./offer-filters";
import type { Bank, Offer, OfferFilters } from "./types";

export { matchesFilters };

// Embed the related merchant row in a single request.
const OFFER_SELECT = "*, merchant:merchants(*)";

interface OfferRow {
  id: string;
  bank_id: string;
  merchant: Offer["merchant"];
  title: string;
  description: string;
  discount_type: Offer["discountType"];
  discount_value: number | string;
  max_discount_cap: number | null;
  min_spend: number | null;
  applicable_days: Offer["applicableDays"];
  time_window: string | null;
  cities: string[];
  eligible_networks: Offer["eligibleNetworks"];
  eligible_tiers: Offer["eligibleTiers"];
  valid_to: string;
  scope_note: string | null;
  exclusions: string | null;
  terms_url: string;
  source_url: string;
  last_verified: string;
  status: Offer["status"];
}

function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    bankId: row.bank_id,
    merchant: row.merchant,
    title: row.title,
    description: row.description,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    maxDiscountCap: row.max_discount_cap ?? undefined,
    minSpend: row.min_spend ?? undefined,
    applicableDays: row.applicable_days,
    timeWindow: row.time_window ?? undefined,
    cities: row.cities,
    eligibleNetworks: row.eligible_networks,
    eligibleTiers: row.eligible_tiers,
    validTo: row.valid_to,
    scopeNote: row.scope_note ?? undefined,
    exclusions: row.exclusions ?? undefined,
    termsUrl: row.terms_url,
    sourceUrl: row.source_url,
    lastVerified: row.last_verified,
    status: row.status,
  };
}

async function fetchAllOffers(): Promise<Offer[]> {
  if (!supabase) return mockOffers;
  const { data, error } = await supabase.from("offers").select(OFFER_SELECT);
  if (error) throw new Error(`Failed to load offers: ${error.message}`);
  return (data as unknown as OfferRow[]).map(mapOffer);
}

export async function getBanks(): Promise<Bank[]> {
  if (!supabase) return mockBanks;
  const { data, error } = await supabase.from("banks").select("*").order("name");
  if (error) throw new Error(`Failed to load banks: ${error.message}`);
  return data as Bank[];
}

export async function getBank(id: string): Promise<Bank | undefined> {
  if (!supabase) return mockBanks.find((b) => b.id === id);
  const { data, error } = await supabase
    .from("banks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load bank: ${error.message}`);
  return (data as Bank | null) ?? undefined;
}

export async function getCities(): Promise<string[]> {
  const cities = new Set<string>();
  for (const offer of await fetchAllOffers()) {
    offer.cities.forEach((c) => cities.add(c));
  }
  return [...cities].sort();
}

export async function getOffers(filters: OfferFilters = {}): Promise<Offer[]> {
  const all = await fetchAllOffers();
  return all.filter((o) => matchesFilters(o, filters));
}

export async function getFeaturedOffers(limit = 6): Promise<Offer[]> {
  const all = await fetchAllOffers();
  return all
    .filter((o) => o.status === "active")
    .sort((a, b) => b.discountValue - a.discountValue)
    .slice(0, limit);
}

export async function getOffer(id: string): Promise<Offer | undefined> {
  if (!supabase) return mockOffers.find((o) => o.id === id);
  const { data, error } = await supabase
    .from("offers")
    .select(OFFER_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Failed to load offer: ${error.message}`);
  return data ? mapOffer(data as unknown as OfferRow) : undefined;
}
