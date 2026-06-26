import type { Offer } from "./types";

/** Tiny classnames helper (avoids a clsx dependency). */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** "20 Jun 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Whole days between `iso` and now (today is treated as 0). */
export function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

/** Short headline for a discount, e.g. "15% OFF", "Rs 500 OFF", "Buy 1 Get 1". */
export function discountHeadline(offer: Offer): string {
  switch (offer.discountType) {
    case "percentage":
      return `${offer.discountValue}% OFF`;
    case "flat":
      return `Rs ${offer.discountValue.toLocaleString()} OFF`;
    case "cashback":
      return `${offer.discountValue}% CASHBACK`;
    case "bogo":
      return "Buy 1 Get 1";
  }
}

/** "Every day", "Tue only", or "Mon–Fri"-style label. */
export function daysLabel(days: Offer["applicableDays"]): string {
  if (days.length === 1 && days[0] === "All") return "Every day";
  if (days.length === 1) return `${days[0]} only`;
  return days.join(", ");
}

export const ALL_NETWORKS = [
  "Visa",
  "Mastercard",
  "UnionPay",
  "PayPak",
  "Amex",
] as const;

export const ALL_TIERS = [
  "Debit",
  "Classic",
  "Gold",
  "Platinum",
  "Titanium",
  "Signature",
  "Infinite",
  "World",
  "World Elite",
] as const;

export const VERTICAL_LABELS: Record<string, string> = {
  restaurant: "Dining",
  hotel: "Hotels",
  travel: "Travel",
  retail: "Shopping",
  health: "Health",
};
