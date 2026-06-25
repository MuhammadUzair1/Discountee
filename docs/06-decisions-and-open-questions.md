# 06 — Decisions & Open Questions

A lightweight decision log (ADR-lite) plus the questions we must answer. Update this as we go — every significant choice gets a line here so future-you knows *why*, not just *what*.

## Decisions taken (initialization)

| # | Decision | Rationale | Status |
|---|---|---|---|
| D1 | FastAPI + Next.js + PostgreSQL(+PostGIS) core stack | Matches your plan; boring/proven; one DB covers relational+FTS+geo | Adopted |
| D2 | Scraping = **tiered pipeline** (httpx+BS → Playwright → PDF tools → OCR/multimodal-LLM), **not Selenium, not Scrapy yet** | Cheapest-tool-that-works; Playwright supersedes Selenium; Scrapy is overkill for a known page list | Adopted |
| D3 | LLM used **offline in ingestion** for normalization, with structured output + human review — not in the live request path | Latency/reliability isolation; legal win (facts not verbatim copy) | Adopted |
| D4 | **Postgres from first app code**; Google Sheets only as throwaway manual-collection store | Don't build a product on a spreadsheet | Adopted |
| D5 | **Defer** Airflow, RAG, EC2/microservices, wallet, geo to later phases | De-risk uncertainty first; don't pre-build | Adopted |
| D6 | **Never store real card numbers**; users pick card *types* only | Stays out of PCI scope; minimal PII | Adopted |
| D7 | Store **normalized facts**, keep raw artifacts internal-only | Copyright/IP safety + data quality | Adopted |
| D8 | MVP = catalog/browse; **wallet + near-me is the Phase-3 headline** | Ship simple to validate; build the habit-forming feature deliberately | Adopted |
| D9 | Deploy backend as single container on managed PaaS; Vercel for frontend | Avoid premature ops; path to ECS/EC2 preserved | Adopted |

## Open questions — must answer before/while building

### Legal & strategic (highest priority — Phase 0)
- [ ] What does a PK lawyer say about scraping public bank offer pages + republishing normalized facts under our brand?
- [ ] Sourcing posture: scrape-first, or lead with manual/crowd + pursue partnerships? (Recommend hybrid.)
- [ ] Disclaimer & takedown policy wording.
- [ ] Trademark usage rules for bank names + network logos (nominative use only; no implied endorsement).

### Product
- [ ] Which 2 pilot banks? (Likely Meezan/HBL — confirm via research on data richness + page type.)
- [ ] City focus for MVP — Karachi only, or KHI+LHR+ISB?
- [ ] Catalog vs wallet/near-me: what does Phase-1 user behavior actually say? (Decides Phase-3 emphasis.)
- [ ] Final product name & domain.

### Data & extraction
- [ ] How volatile are offers in practice → sets re-scrape cadence and the freshness SLO.
- [ ] Merchant/branch dedup approach (alias table + fuzzy match thresholds; when to require human confirm).
- [ ] Geocoding source for branches (Google Maps API vs OpenStreetMap/Nominatim — cost vs coverage in PK).

### LLM / tech
- [ ] Which model/provider for extraction? Evaluate small candidates (free/cheap tiers + a quality option) on a **labeled sample** for precision/recall before committing. Record result here.
- [ ] Acceptable extraction precision threshold before relaxing human review.
- [ ] Search: how long does Postgres FTS suffice before considering Typesense/Elasticsearch?

### Business
- [ ] Primary monetization to design for first (recommend affiliate card-apply lead-gen) → what intent signals must the data model capture now?

## How to use this file
- When you make a real decision, add a `D#` row with the rationale.
- When a decision reverses, don't delete it — add a new row that supersedes it and note "supersedes D#". The history is the value.
- Move answered open questions into decisions.
