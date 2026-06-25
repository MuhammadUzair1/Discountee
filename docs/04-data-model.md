# 04 — Data Model

The schema *is* the product. Getting offers, cards, merchants, and branches modeled cleanly is what lets you answer "best card for X near me" — the thing scattered bank pages cannot. Design this carefully before writing scrapers; the LLM normalizes *into* this schema.

## Core entities (conceptual)

```
Bank ──< Card >── CardNetwork (Visa/Mastercard/UnionPay/PayPak/Amex)
                    Card.tier (Debit/Credit/Gold/Platinum/Titanium/Signature/Infinite/World Elite...)

Merchant ──< Branch (lat/lng, city, address)        Merchant ──< Category (cuisine/vertical)

Offer ──< OfferCardEligibility >── Card     (which cards unlock this offer; many-to-many)
Offer ──< OfferBranch >── Branch            (where it applies; many-to-many; or "all branches")
Offer ── SourceDocument                     (provenance: url, raw artifact, scrape run)
Offer ── (normalized constraints: days, time window, % , caps, exclusions)
```

## Entity reference

### `bank`
`id, name, slug, logo_url, website, country='PK', created_at`

### `card_network`
`id, name` — enum-like: Visa, Mastercard, UnionPay, PayPak, Amex.

### `card`
The specific product a bank issues on a network at a tier.
`id, bank_id, network_id, tier, name, card_type(debit|credit|prepaid), image_url`
- `tier`: Gold, Platinum, Titanium, Signature, Infinite, World/World Elite, Standard/Classic, etc. Keep as a controlled vocabulary (lookup table) so filtering is reliable.
- A user "selecting a card" in the UI = (bank, network, tier) → resolves to one or more `card` rows.

### `merchant`
`id, name, slug, logo_url, website, primary_category_id`
- Dedup carefully — "KFC", "KFC Pakistan", "K.F.C" must merge. Plan a normalization/alias table.

### `category`
`id, name, vertical(restaurant|hotel|travel|retail|health|...), parent_id`
- Restaurants first; verticals expand later. Cuisine as sub-categories under `restaurant`.

### `branch`
`id, merchant_id, city, area, address, lat, lng (geography point — PostGIS), phone`
- Geo column powers "near me". Geocode addresses during ingestion (cache results).

### `offer` — the central table
| field | notes |
|---|---|
| `id` | |
| `merchant_id` | FK |
| `title` | our normalized, plain-language title (NOT verbatim bank copy) |
| `description` | normalized facts, our words |
| `discount_type` | `percentage` \| `flat_amount` \| `bogo` \| `cashback` \| `bundle` \| `other` |
| `discount_value` | numeric (e.g., 15 for 15%, or amount in PKR) |
| `max_discount_cap` | PKR cap if any |
| `min_spend` | PKR minimum if any |
| `applicable_days` | normalized set: {Mon..Sun} or "all" |
| `time_start` / `time_end` | window if any (e.g., dinner only) |
| `valid_from` / `valid_to` | offer dates; auto-expire past `valid_to` |
| `applies_to_scope` | `whole_bill` \| `food_only` \| `specific_items` (the "desserts only" case) |
| `scope_note` | free-text normalized exception ("desserts only", "dine-in only") |
| `exclusions` | normalized exclusions ("not on weekends/public holidays") |
| `city_scope` | `all` or specific cities (also via OfferBranch) |
| `terms_url` / `source_url` | provenance |
| `status` | `active` \| `expired` \| `unverified` \| `disabled` |
| `confidence` | 0–1, from extraction/validation |
| `last_scraped_at` / `last_verified_at` | freshness — surfaced in UI |
| `created_at` / `updated_at` | |

> Note: the original "Applicable Days / Time / % / Branches / Expiry / T&Cs / Card Eligibility / Source URL / Last Updated" list from the brief maps directly onto the fields above — but split into *structured, queryable* columns plus normalized constraint fields, so we can actually filter and compare. That structuring is what the LLM does in the pipeline.

### `offer_card_eligibility` (M:N offer↔card)
`offer_id, card_id` — which exact cards unlock the offer. This is what powers "best card for this merchant": given a user's cards, find offers where eligibility intersects.

### `offer_branch` (M:N offer↔branch)
`offer_id, branch_id` — or a flag `all_branches=true` on the offer when it's chain-wide.

### `source_document` (provenance / audit / legal)
`id, source_url, source_type(html|pdf|image|api), raw_artifact_ref(S3 key), fetched_at, scrape_run_id, content_hash`
- `content_hash` → detect "did the source actually change?" and avoid re-processing identical fetches.

### `scrape_run`
`id, source_id, started_at, finished_at, status, offers_found, offers_upserted, errors` — observability for drift detection (sudden drop in `offers_found` = alert).

### (Phase 3) `user` & `user_card`
`user(id, ...minimal)`, `user_card(user_id, bank_id, network_id, tier)` — **card *types* only, never card numbers.** Powers the personalized wallet feed.

### (crowdsourcing) `offer_feedback`
`id, offer_id, verdict(worked|did_not_work|expired|wrong), note, created_at, source(user|anon)` — your freshest accuracy signal; drives `last_verified_at` and trust badges.

## Key query patterns the model must serve
1. **Catalog (MVP):** offers where eligible cards ∈ (bank, network, tier), filtered by city/category/day/time, sorted by discount or freshness.
2. **Best card for merchant (Phase 3):** given `user_card` set → offers at merchant where eligibility intersects → rank by effective discount.
3. **Near me (Phase 3):** PostGIS `ST_DWithin(branch.geog, user_point, radius)` → join to active offers → rank by distance × discount.
4. **Freshness governance:** auto-set `status='expired'` past `valid_to`; down-rank `unverified`; surface `last_verified_at` everywhere.

## Data-quality rules (enforce in pipeline, not just UI)
- No offer goes `active` without: merchant, ≥1 eligible card, a discount value/type, and a source URL.
- Verbatim bank marketing copy is **not** stored as user-facing text — only normalized facts (legal + quality).
- Every active offer must have a `last_verified_at`; stale ones (> N days) are visibly flagged.
- Merchant/branch dedup before insert (alias table + fuzzy match + human confirm on ambiguity).
