# 02 — Product Strategy

## Vision
Become the single, trusted source for "where do my bank cards save me money in Pakistan" — starting with restaurants, expanding across verticals — and eventually the layer banks and merchants *want* to be on because it drives card usage.

## Target users (be specific)
- **Primary:** urban, card-carrying middle/upper-middle class in Karachi, Lahore, Islamabad. Multiple cards, deal-conscious, dine out often, mobile-first.
- **Secondary:** new card applicants comparing what a card unlocks (→ feeds the affiliate model).
- **Not now:** rural, cash-only, B2B/corporate cards. Don't dilute focus.

## The real job-to-be-done
Two distinct jobs. Be honest about which you're serving in each phase.

1. **Browse / research (catalog job):** "What do I get with my HBL Visa Signature?" — discrete, occasional, easy to satisfy with the bank→card→tier model.
2. **Decide at point-of-purchase (wallet job):** "I'm about to pay / I'm hungry near here — which of my cards is best *right now*?" — frequent, high-value, viral, and *much* harder. This is the job that creates a daily-use habit.

> Strategic call: **MVP serves job #1** (proves the data and is simple to build). **The headline product serves job #2** (wallet + location). The roadmap is sequenced to get from one to the other deliberately — see [05-roadmap-and-phases.md](05-roadmap-and-phases.md).

## Navigation model — recommendation
Support both, introduced in order:
- **Phase 1 (MVP):** Catalog browse — `Bank → Network → Tier → Offers`, plus free-text + filter search (city, category, day). Simple, no login.
- **Phase 3:** **"My Wallet"** — user saves their card *types* once (never card numbers), gets a personalized feed: "best offers for your cards", and "best card for this merchant/category near you." This is the retention engine.

## Differentiation / why we win
The UI is not the moat. The moat is **coverage × freshness × trust**, compounded by:
- **Trust signals competitors won't bother with:** per-offer "last verified" date, source link, confidence, and crowd-verified ("12 people confirmed this worked") badges.
- **Normalized, comparable data** — every offer in one clean schema so we can actually answer "best card for X", which scattered bank pages can't.
- **The wallet + geo experience** — nobody in PK does "best card for this merchant near me" well.

## MVP scope (ruthless)
**In:**
- Restaurants vertical only.
- 2 pilot banks, ~100–200 verified offers (hand-curated to start).
- Catalog browse + search + filters (city, category, day/time, network, tier).
- Offer detail page with full normalized fields + provenance + disclaimer.
- "Report incorrect offer" button.
- Mobile-first responsive web. No native app, no login.

**Out (deferred, on purpose):**
- Scraping automation, Airflow, RAG chat, wallet/login, geo/"near me", multi-vertical, notifications, multi-language UI.

**MVP success = we can answer:** *Do target users find this useful enough to return and recommend, and can we keep ~150 offers accurate with manual effort?* If yes → automate. If no → fix the value prop before automating anything.

## Success metrics
- **North Star:** weekly active users who view ≥1 offer detail (intent), trending up.
- **Trust/quality:** % offers verified in last 30 days (target >90%); incorrect-offer reports per 100 views (drive down).
- **Engagement:** searches/session; offer-detail views; return rate (W1→W4).
- **Phase-3+ business:** "best card" computations; affiliate card-apply click-throughs.

## Monetization (summary — detail in evaluation doc)
Affiliate card-application lead-gen (best aligned), merchant featured/verified placements, premium alerts/filters. Capture intent signals in the data model now; don't bolt on later.

## Risks owned by Product (not Eng)
- **Cold-start data coverage** — thin data = no value. Mitigate with hand-curation + crowd contributions before relying on scrapers.
- **Trust erosion from stale data** — see freshness strategy in evaluation + data-model docs.
- **Single-vertical ceiling** — restaurants validate; hotels/travel/retail expand TAM. Sequence after restaurants are nailed.
