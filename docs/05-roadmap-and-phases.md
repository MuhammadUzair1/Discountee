# 05 — Roadmap & Phases

Operating rule you set, and I fully endorse: **build → test → document → next.** Nail one feature before moving on. Each phase below has an explicit **exit criterion** — you don't advance until it's met.

The sequencing principle: **de-risk the hard/uncertain things first** (legal posture, does-anyone-want-this, can-we-keep-data-accurate) and defer the fun/known things (Airflow, RAG, geo) until they're earned.

---

## Phase 0 — Foundation, validation & legal (≈1–2 weeks) — *no scrapers, barely any code*
**Goal:** prove the idea is legally workable and worth building before investing in engineering.

- Legal/strategy: one consult with a PK lawyer on scraping/IP/trademark posture; decide disclaimers and sourcing stance.
- Pick **2 pilot banks** with rich, public, mostly-static offer pages (validate during research — Meezan/HBL are likely candidates).
- Lock the **canonical offer schema** ([04](04-data-model.md)) by hand-mapping ~20 real offers into it. The schema *will* be wrong in places — find out now, on paper.
- **Hand-curate ~100 verified offers** into a spreadsheet (this is your throwaway collection store *and* your launch content).
- Repo scaffolding + CI skeleton (lint/test/build), but **no product code yet**.

**Exit criterion:** ~100 offers correctly expressed in the schema; legal posture decided; the schema survived contact with real, messy offers.

---

## Phase 1 — MVP: read-only catalog app (≈3–4 weeks)
**Goal:** ship something real users can use; learn whether they value it and *how* they navigate.

- Postgres (+PostGIS extension installed even if unused yet) + Alembic migrations of the canonical schema.
- Load the ~100–200 curated offers (CSV/Sheet → DB importer; **this importer is the seed of the ingestion pipeline**).
- FastAPI read API: `/banks`, `/cards`, `/offers` with filters (city, category, day, network, tier), `/search`, `/offers/{id}`.
- Next.js app on Vercel: browse `Bank → Network → Tier → Offers`, search + filters, offer detail page with **provenance + freshness + disclaimer**, "Report incorrect offer" button.
- Deploy backend as a single container (Railway/Render/Fly) + managed Postgres.
- Get it in front of **20–50 real target users**; instrument basic analytics (what they search, what they open, do they return).

**Exit criterion:** real users using it; clear signal on (a) is this valuable, (b) catalog vs wallet/near-me demand. Manual data stays accurate with reasonable effort.

---

## Phase 2 — Ingestion automation + human-in-the-loop (≈4–6 weeks)
**Goal:** replace manual curation with a semi-automated, *verified* pipeline. Only now do scrapers appear.

- Build scrapers for the 2 pilot banks using the **tiered pipeline** ([03](03-technical-architecture.md)): httpx+BS → Playwright → PDF → image/OCR.
- **LLM normalization** (offline/batch): raw text/image → canonical schema, structured output, validated.
- Raw-artifact snapshots to object storage; `source_document` + `scrape_run` provenance and **drift detection** (alert on sudden offer-count drops).
- **Admin review UI** (the critical piece): a human approves/edits LLM-extracted offers before they go `active`. Track precision; loosen review only as precision proves out.
- Scheduling via **cron/APScheduler** (NOT Airflow yet). Re-scrape on an interval; auto-expire past `valid_to`.
- Wire the **"Report incorrect offer"** feedback into `offer_feedback` → freshness signals.

**Exit criterion:** pilot-bank offers refresh automatically with human review; extraction precision is measured and acceptable; stale/expired offers are handled automatically.

---

## Phase 3 — Wallet + location ("the killer feature") (≈4–6 weeks)
**Goal:** turn a useful directory into a daily-habit product.

- Minimal accounts + **"My Wallet"**: save card *types* (never numbers) → personalized "offers for your cards" feed.
- **PostGIS "near me"**: geocode branches; "best offers near me" and "best card for this merchant/category nearby", ranked by distance × effective discount.
- Crowd verification surfaced as trust badges ("confirmed by N users").
- Redis caching for hot geo/search queries.

**Exit criterion:** users save cards and return for the personalized/near-me feed; retention (W1→W4) improves measurably vs Phase 1.

---

## Phase 4 — Intelligence & scale (ongoing)
**Goal:** scale data ops and add the smart layer — now that clean data and real demand exist.

- Scale to 10+ banks → *now* graduate scheduling to **Prefect/Airflow** (earned, not premature).
- **RAG chat** over the clean structured dataset ("best dinner deal in DHA Karachi this Friday?").
- Proactive **alerts/notifications** ("new offer near you for your card").
- Harden CI/CD; observability/alerting; move infra toward ECS/EC2 if cost/control demands.

**Exit criterion:** data ops scale without linear human effort; intelligence features show engagement lift.

---

## Phase 5 — Vertical & business expansion (ongoing)
- New verticals: hotels, travel, transport, retail, health.
- Monetization live: affiliate card-apply lead-gen, merchant featured/verified placements, premium alerts.
- Pursue **official bank/merchant partnerships & feeds** — the endgame that retires scraping risk and deepens the moat.

---

## Cross-cutting (every phase, not a phase)
- **Testing:** unit (extractors/normalizers), schema/contract tests, a small golden-set of offers to catch extraction regressions.
- **Documentation:** keep these docs current; add an ADR to [06](06-decisions-and-open-questions.md) for each significant decision.
- **Data quality SLOs:** % verified in last 30 days; incorrect-report rate. Treat regressions as P1.

## What we are deliberately NOT doing early (and when we will)
| Deferred | Earliest phase | Trigger |
|---|---|---|
| Airflow/Prefect | 4 | 5+ reliable scrapers |
| RAG chat | 4 | clean dataset + proven demand |
| Wallet/login | 3 | catalog value validated |
| Geo / near-me | 3 | (same) |
| EC2/microservices | 4+ | real load or control needs |
| Multi-vertical | 5 | restaurants nailed |
