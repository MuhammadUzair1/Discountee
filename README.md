# Bank Discount Discovery — Pakistan (working name)

> Single source of truth for bank-card discounts in Pakistan. Pick your bank, card network and tier — instantly see where you save, and (later) what's the best card to use right now near you.

**Status:** Project initialization / pre-build. No code yet. This repo currently holds the founding plan.

**Working name candidates:** `Bachat` / `BachatCard` (بچت = "savings"), `CardWise`, `Riayat` (رعایت = "discount/concession"). Branding TBD — see [docs/02-product-strategy.md](docs/02-product-strategy.md).

---

## Read these in order

| # | Doc | What it answers |
|---|-----|-----------------|
| 0 | [docs/01-cto-evaluation-and-risks.md](docs/01-cto-evaluation-and-risks.md) | A blunt assessment of the idea. What will kill this product, what to change, what to drop. **Read first.** |
| 1 | [docs/02-product-strategy.md](docs/02-product-strategy.md) | Who it's for, the real job-to-be-done, the navigation model debate, MVP scope, monetization, metrics. |
| 2 | [docs/03-technical-architecture.md](docs/03-technical-architecture.md) | System design, the scraping-tool evaluation + recommendation, LLM extraction, infra, security. |
| 3 | [docs/04-data-model.md](docs/04-data-model.md) | The canonical offer schema — the heart of the product. Entities, relationships, provenance, freshness. |
| 4 | [docs/05-roadmap-and-phases.md](docs/05-roadmap-and-phases.md) | Phase-by-phase execution plan with exit criteria. Build → test → document → next. |
| 5 | [docs/06-decisions-and-open-questions.md](docs/06-decisions-and-open-questions.md) | Decision log (ADR-lite) and the questions we must answer before/while building. |

## The one-paragraph version

The idea is strong and the market is real, but the hardest problems are **not** technical — they are **legal/IP risk** and **data freshness/accuracy**. Web scraping bank sites should be *one* input, never the whole strategy. The first milestone is **not** a scraper or Airflow or RAG; it is a **hand-curated dataset of ~100 verified offers** behind a dead-simple app, shipped to real users to prove demand. Everything fancy (Airflow, RAG chat, microservices, EC2 clusters) is deferred until the data and the demand exist. See the evaluation doc for why.

---

## Repository layout (monorepo)

```
bank-discounts-pk/
├─ docs/         # the founding plan (read these first)
├─ frontend/     # Next.js 16 + React 19 + Tailwind 4 (App Router, TS)  → Vercel
├─ backend/      # FastAPI + SQLAlchemy + PostGIS (serving + admin API) → container
├─ ingestion/    # scrapers + extraction pipeline (Phase 2; structure only for now)
├─ infra/        # docker-compose for local Postgres/PostGIS + Redis
└─ data/         # seed datasets (tracked) + raw/cache artifacts (ignored)
```

A monorepo keeps the shared offer schema honest across `backend` and `ingestion`.

## Getting started

**Frontend (current focus):**
```bash
cd frontend
cp .env.example .env.local      # set NEXT_PUBLIC_API_BASE_URL
npm install                     # already installed by scaffolding
npm run dev                     # http://localhost:3000
```

**Backend (later phase):** see [backend/README.md](backend/README.md).
**Local database:** see [infra/README.md](infra/README.md).

## Status / next steps

- [x] Founding plan & architecture docs
- [x] Monorepo scaffold (frontend, backend skeleton, infra, ingestion stub)
- [ ] **Frontend build — in progress** (current phase)
- [ ] Canonical schema → SQLAlchemy models + first Alembic migration
- [ ] Read API over seed data
- [ ] Ingestion pipeline (Phase 2)

