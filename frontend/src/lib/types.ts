// Core domain types for the Discountee frontend.
// These mirror the canonical schema in docs/04-data-model.md (trimmed to what the
// UI needs). The data layer (lib/api.ts) returns these shapes today from mock data
// and will return the same shapes from the FastAPI backend later — so components
// never change.

export type CardNetwork = "Visa" | "Mastercard" | "UnionPay" | "PayPak" | "Amex";

export type CardTier =
  | "Debit"
  | "Classic"
  | "Gold"
  | "Platinum"
  | "Titanium"
  | "Signature"
  | "Infinite"
  | "World"
  | "World Elite";

export type DiscountType = "percentage" | "flat" | "bogo" | "cashback";

export type Vertical = "restaurant" | "hotel" | "travel" | "retail" | "health";

export type OfferStatus = "active" | "expired" | "unverified";

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Bank {
  id: string;
  name: string;
  /** Short monogram for the logo chip, e.g. "MZN". */
  monogram: string;
  /** Brand colour (hex) used for the bank chip. */
  color: string;
}

export interface Merchant {
  id: string;
  name: string;
  /** Cuisine or sub-category, e.g. "BBQ & Pakistani". */
  category: string;
  vertical: Vertical;
}

export interface Offer {
  id: string;
  bankId: string;
  merchant: Merchant;
  title: string;
  description: string;
  discountType: DiscountType;
  /** For percentage: 15 = 15%. For flat/cashback: amount in PKR. For bogo: ignored. */
  discountValue: number;
  maxDiscountCap?: number;
  minSpend?: number;
  /** ["All"] or a subset of weekdays. */
  applicableDays: Array<Weekday | "All">;
  /** Human label like "Dinner · 7pm–11pm". */
  timeWindow?: string;
  cities: string[];
  eligibleNetworks: CardNetwork[];
  eligibleTiers: CardTier[];
  /** ISO date (YYYY-MM-DD). */
  validTo: string;
  /** Normalized exception, e.g. "Valid on desserts only". */
  scopeNote?: string;
  /** Normalized exclusion, e.g. "Not valid on weekends & public holidays". */
  exclusions?: string;
  termsUrl: string;
  sourceUrl: string;
  /** ISO date the offer was last confirmed against the source. */
  lastVerified: string;
  status: OfferStatus;
}

export interface OfferFilters {
  bankId?: string;
  network?: CardNetwork;
  tier?: CardTier;
  city?: string;
  vertical?: Vertical;
  search?: string;
}
