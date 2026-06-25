# 01 — CTO Evaluation & Risks

My job here is to maximize the odds this becomes the leading bank-discount platform in Pakistan — which means telling you where the plan is wrong, not where it's exciting. The idea is genuinely good. The plan as written over-indexes on the fun technical parts and under-indexes on the two things that actually decide whether this product lives or dies.

## The verdict in one line

**Build the data flywheel and the legal posture first. The scraping/Airflow/RAG stack is the easy 20% you've spent 80% of the vision on.**

---

## What's right about the idea

- **Real, unsolved pain.** Bank offer info in Pakistan is genuinely scattered, inconsistent, and stale. Banks themselves are bad at surfacing it. This is a real wedge.
- **Clear initial scope.** "Pick bank → network → tier → see offers" is a concrete, shippable MVP. Good.
- **Strong long-term moat *if* you win data.** Whoever has the most complete, freshest, most trustworthy dataset wins. Data + trust is the moat, not the UI.
- **Sensible default stack.** FastAPI + Next.js + Postgres is the right boring choice. Vercel for frontend is fine.

---

## The five risks that actually matter (ranked)

### 1. Legal / IP / brand risk — THIS IS THE #1 KILLER, not a footnote
You are planning to scrape banks' websites and republish their promotional content, their merchant relationships, and the **Visa/Mastercard/UnionPay/PayPak** trademarks, under your own brand, as a commercial product.

- **Terms of Service.** Most bank sites prohibit automated access and redistribution of content. Scraping may breach ToS even where it isn't strictly "illegal."
- **Copyright.** Offer descriptions, banners, and especially the offer *images/PDFs* are copyrighted material. Republishing them verbatim is infringement. Extracting *facts* (merchant X gives 15% on Visa Signature, expires Y) is far safer — facts aren't copyrightable, expression is. **This is a strong reason to use the LLM to re-express offers as structured facts rather than copy-pasting bank text.**
- **Trademark.** Using bank names and network logos is generally OK for *nominative/descriptive* reference ("offers for HBL cards"), but implying endorsement or partnership is not. No bank logos as if they sponsor you.
- **Pakistan-specific.** PECA 2016 (Prevention of Electronic Crimes Act) criminalizes unauthorized access to information systems — aggressive scraping that trips security controls is a real exposure. SBP (State Bank) is the regulator banks answer to; banks are conservative and litigious about brand misuse.
- **Liability for wrong info.** If a user drives across Karachi for "50% off" that expired last week, you own that reputational damage — and a sufficiently angry merchant/bank could claim you misrepresented their offer.

**Mitigations (do these, don't skip):**
- Store **facts, not verbatim copy**. Normalize every offer into your own schema and your own words via the LLM. Keep the raw source only internally for verification/audit.
- Show **provenance + freshness on every offer**: source URL, "last verified", and a prominent disclaimer that the bank's T&Cs are authoritative.
- Add a clear **"Report incorrect offer"** path and honor takedown requests fast.
- **Robots.txt + polite scraping** (rate limits, identifiable user agent, no auth-walled content). Never scrape anything behind login.
- Talk to a **Pakistani lawyer** before public launch. Budget a few hundred dollars for one consult. Cheap insurance.
- **Reframe the long game as partnership, not parasitism.** The winning version of this is banks/merchants *wanting* to be listed (it drives card usage). Scraping bootstraps the dataset; the endgame is official feeds and affiliate deals. Design for that from day one.

### 2. Data freshness & accuracy — the product is only as good as its worst stale offer
Offers change weekly. A discount directory that's even 10% wrong is worse than useless — it destroys trust, and trust is the entire value proposition. This is an **operations** problem, not a coding problem, and scraping alone will not solve it.

**Mitigations:**
- Treat data as a **pipeline with verification**, not a one-time scrape. Every offer carries `last_verified`, `confidence`, and `status` (active/expired/unverified).
- **Human-in-the-loop from day one.** Build a tiny internal review/admin screen before you build fancy automation. A human confirms LLM-extracted offers until precision is proven.
- **Crowdsource corrections.** "Was this offer honored? 👍/👎" + report button. Your users are your freshest sensor network — far fresher than any scraper.
- Auto-expire offers past their end date and visibly down-rank `unverified` ones.

### 3. Scraping fragility & over-reliance
Bank sites change layout, add anti-bot, render via JS, or bury offers in PDFs/images. A scraper-only strategy means constant breakage and silent data rot. Scraping is a **bootstrapping tactic**, not the data strategy.

**Mitigation:** hybrid sourcing — scraping + manual curation + crowdsourcing + (later) official partnerships/affiliate feeds. Don't let scraper health gate the product.

### 4. You're building the cathedral before laying a brick
The vision lists Airflow DAGs, a RAG chatbot, LLM normalization, EC2 fleets, CI/CD, multi-vertical expansion — before a single verified offer exists or a single user has said "yes, I'd use this." Every one of those is **premature** for what you need to learn first: *do people want this, and can you keep the data correct?*

**Mitigation — sequence ruthlessly:**
- Airflow → **not until you have 5+ scrapers running reliably.** Use cron/APScheduler first. Airflow is operational overhead you haven't earned.
- RAG chat → **not until you have a real, clean dataset.** RAG over 80 messy offers is a toy; it's also the wrong first interface for "I want the best deal near me" (that's structured search + geo, not chat).
- Microservices/EC2 fleet → **one container, one Postgres.** Scale when load demands it, not before.
- Google Sheets as DB → fine for the *throwaway* week-1 spreadsheet you curate by hand; **do not build the app on it.** Go to Postgres the moment you write code against the data.

### 5. The navigation model may be backwards (UX risk)
"Select bank → network → tier → browse offers" is a **catalog** model. It assumes the user already knows and is loyal to one card. But the highest-value, most viral moment is the opposite question:

> "I'm standing outside a restaurant / I'm about to pay — **which of my cards gives me the best discount right now?**"

That's a **wallet-first**, location-first model. It's also your eventual "nearest to me" feature — which is not a nice-to-have, it's probably the *killer* feature and the real reason to build the geo layer early-ish.

**Recommendation:** ship the catalog/browse model in the MVP (it's simple and proves the data), but design the data model and roadmap so the **wallet + location** experience ("save my cards once → personalized best-deal feed near me") is the Phase-3 centerpiece. Don't let the bank-first drill-down become the product's ceiling.

---

## Assumptions I'm challenging explicitly

| Your assumption | My pushback | Recommendation |
|---|---|---|
| Scraping is the data strategy | It's a bootstrap tactic; it rots and has legal exposure | Hybrid: scrape + curate + crowdsource → partnerships |
| Google Sheets could be the store | Fine to *collect* in, fatal to *build* on | Postgres (+ PostGIS) from first line of app code |
| Airflow for scheduling | Premature ops overhead | cron/APScheduler now; Prefect/Airflow at 5+ scrapers |
| RAG chat is a near-term feature | Wrong interface + needs clean data first | Structured search + geo first; chat much later |
| EC2 + microservices | Over-built for day one | One container + managed Postgres; scale on evidence |
| Bank→card→tier is the UX | Catalog model misses the killer moment | Add wallet-first + location as the headline experience |
| "Free LLM" everywhere | Fine for batch extraction with review; risky in the live user path | LLM for offline normalization + human review; not a live dependency |

---

## What I'd do in the first 30 days (the un-sexy version)

1. **Validate legally & strategically.** One lawyer consult. Decide the sourcing posture and disclaimers.
2. **Pick 2 pilot banks** with rich, public offer pages (e.g., Meezan, HBL — confirm during research).
3. **Hand-curate ~100 offers** into the canonical schema in a spreadsheet. No scraping yet. This validates the schema *and* the UX *and* gives you real launch content.
4. **Ship a read-only app** (Next.js + FastAPI + Postgres) over that data to ~20–50 real users (friends, r/pakistan, card-holder groups).
5. **Watch what they actually do.** Do they browse by bank, or do they ask "best deal near me"? That answer reshapes the roadmap.

Only *after* that do you build scrapers, then automation, then geo, then intelligence. See [05-roadmap-and-phases.md](05-roadmap-and-phases.md).

---

## Monetization (so the architecture serves a business, not a hobby)

Worth naming now because it influences what data you capture:
- **Affiliate / lead-gen to banks** — "apply for the card that unlocks this offer" (cards are a high-margin bank product; this aligns incentives beautifully).
- **Merchant promotion** — featured/boosted offers, verified badges.
- **Premium** — alerts ("your card just got a new offer near you"), advanced filters.
- **Data/insights** — anonymized demand signals to banks/merchants (later, carefully).

Implication for the data model: capture enough to attribute clicks/intent (offer views, "best card" computations, location context) without collecting sensitive financial data. **Never store card numbers** — users select card *types*, never real card data.
