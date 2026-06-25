# 03 — Technical Architecture

Guiding principle: **boring, simple, and right-sized.** Build for the next 10x, not the next 1000x. Every component below earns its place only when load or learning demands it.

## High-level system

```
                    ┌─────────────────────────────┐
   Users  ───────▶  │  Next.js (Vercel)           │   SSR/ISR, mobile-first
                    │  - browse / search / detail │
                    └──────────────┬──────────────┘
                                   │ HTTPS (REST/JSON)
                                   ▼
                    ┌─────────────────────────────┐
                    │  FastAPI (one container)    │   read API + admin API
                    │  - /offers /search /filters │
                    │  - /admin (review, CRUD)    │
                    └───────┬─────────────┬───────┘
                            │             │
                   ┌────────▼───┐   ┌─────▼─────────┐
                   │ PostgreSQL │   │ Redis (cache, │
                   │ + PostGIS  │   │ later: queue) │
                   └────────────┘   └───────────────┘
                            ▲
            ┌───────────────┴───────────────────────┐
            │  Ingestion pipeline (separate worker)  │   scheduled, NOT in API path
            │  fetch → extract → normalize(LLM) →    │
            │  validate(human) → upsert              │
            └───────────────┬───────────────────────┘
                            ▼
                   ┌──────────────────┐
                   │ Object storage   │  raw HTML/PDF/img snapshots
                   │ (S3 / local now) │  for audit + re-processing
                   └──────────────────┘
```

**Key separation:** the **ingestion pipeline is fully decoupled from the serving API.** Scraper breakage, LLM latency, or a bad run must never affect the user-facing app. They communicate only through the database.

## Tech-stack decisions

| Layer | Choice | Why / alternative |
|---|---|---|
| Frontend | **Next.js (App Router) on Vercel** | As you planned. SSR/ISR for SEO (discovery via Google matters here). |
| Backend API | **FastAPI** | As you planned. Async, typed, great DX, Pydantic = free validation + schema. |
| DB | **PostgreSQL + PostGIS** | One DB does relational + full-text + geo. PostGIS is non-negotiable for "near me". Managed (RDS/Supabase/Neon) to avoid ops. |
| Cache | **Redis** | Cache hot search/filter responses; later doubles as job broker. Add when needed. |
| ORM/migrations | **SQLAlchemy 2.0 + Alembic** | Versioned schema from day one — the schema *is* the product. |
| Object storage | **S3** (local dir in dev) | Keep raw artifacts for audit/re-extraction and legal provenance. |
| Search | **Postgres FTS first** | Don't add Elasticsearch/Typesense until FTS demonstrably falls short. |
| Scheduling | **APScheduler/cron → Prefect/Airflow later** | Don't start with Airflow. Earn it at 5+ reliable scrapers. |
| Container | **Docker** | Reproducible scraper env (Playwright browsers) + portable deploy. |

## Hosting / infra — pushback on "EC2 + microservices"
You named EC2. Fine eventually, but for MVP it's premature ops burden.

- **Recommended now:** frontend on **Vercel**; backend as a **single container** on a managed platform (**Railway / Render / Fly.io**, or AWS **App Runner / ECS Fargate**). Managed **Postgres** (Supabase/Neon/RDS). Run scrapers as **scheduled container jobs**, not a standing fleet.
- **Why not raw EC2 yet:** you'd hand-manage OS, TLS, scaling, Playwright system deps, restarts. That's undifferentiated heavy lifting at zero-user stage.
- **Why not Lambda for scraping:** Playwright + headless Chromium on Lambda is painful (size/cold-start). A container job is simpler and cheaper to reason about.
- **Graduate to EC2/ECS** when cost or control genuinely demands it (real traffic, heavy scrape parallelism). Architecture above moves there without a rewrite.

## Scraping strategy — tool evaluation (the explicit ask)

There is **no single right tool** — the right answer is a **tiered pipeline** that uses the cheapest tool that works and escalates only when needed.

### The candidates

| Tool | Type | Strengths | Weaknesses | Verdict |
|---|---|---|---|---|
| **BeautifulSoup** (+ `httpx`) | HTML parser | Tiny, fast, simple; perfect for static HTML | Can't execute JS; no crawling/scheduling | ✅ **Default for static pages.** Pair with `selectolax` if you need more speed. |
| **Playwright** | Headless browser | Renders JS/SPAs, auto-waits, intercepts network (often you can grab the JSON API directly), screenshots, handles PDFs/downloads, async, multi-browser | Heavy (ships Chromium), slower, more RAM | ✅ **Default for dynamic/JS pages.** Modern, better API than Selenium. |
| **Selenium** | Headless browser | Mature, huge community | Older API, flakier waits, heavier setup than Playwright | ❌ **Skip.** Playwright supersedes it for new projects. |
| **Scrapy** | Crawl framework | Built-in concurrency, retries, pipelines, throttling, dedup at scale | Steep curve; overkill for ~30 known bank pages; JS needs add-ons | ⚠️ **Not now.** Adopt only if you crawl *many* pages/sites at scale. For a known list of bank offer pages, structured Playwright/BS jobs + your own pipeline are simpler. |

### Recommended optimal combination — a tiered fetch+extract pipeline
For each target source, walk down only as far as needed:

```
1. STATIC  →  httpx + BeautifulSoup (or selectolax)
   └─ if content missing / page is JS-rendered ↓
2. DYNAMIC →  Playwright (and: try to capture the underlying XHR/JSON API — best case, no HTML parsing at all)
   └─ if offer lives in a PDF ↓
3. PDF     →  PyMuPDF (fitz) for text; pdfplumber / Camelot for tables
   └─ if PDF/page is scanned or offer is in an image ↓
4. IMAGE / SCANNED  →  OCR (Tesseract / pytesseract) — or a multimodal LLM that reads the image and returns structured fields directly (often higher quality than OCR+regex)
                        AWS Textract is the managed fallback for messy documents.

THEN for ALL paths:
5. NORMALIZE →  LLM with STRUCTURED OUTPUT → maps raw text to the canonical offer schema
6. VALIDATE  →  schema/business-rule checks + human review (until precision is proven)
7. UPSERT    →  Postgres, with provenance + confidence + a stored raw-artifact reference
```

**Engineering notes that save you pain later:**
- **Always prefer the hidden JSON API** over scraping rendered HTML. Open the bank page in devtools → Network; many "dynamic" sites fetch offers from an endpoint you can call directly. Far more robust than DOM scraping.
- **Snapshot every raw artifact** (HTML/PDF/image) to object storage *before* parsing — enables re-extraction when you improve the parser, and is your provenance/audit trail.
- **One scraper per source, behind a common interface** (`fetch() -> raw`, `extract(raw) -> list[RawOffer]`). Sources break independently; isolate the blast radius.
- **Be polite & defensible:** respect robots.txt, set a clear/identifiable user-agent, rate-limit, back off, **never touch auth-walled content.** (See legal section in [01](01-cto-evaluation-and-risks.md).)
- **Detect drift, don't fail silently:** if a scraper returns ~0 offers when it used to return many, alert. Silent data rot is the real enemy.

## LLM usage — where it belongs (and where it doesn't)
The LLM is a fantastic fit for the messy-text → structured-facts problem you described ("10% on desserts only", "Tuesdays only", "not valid on weekends"). Use it deliberately:

- **Use it OFFLINE, in the ingestion pipeline** — not in the live user request path. Extraction is batchy and latency-tolerant; the serving API must stay fast and reliable.
- **Demand structured output** (JSON conforming to the canonical schema) and **validate every field** before persisting.
- **Re-express as facts, not copy** — this is both a quality and a *legal* win (facts aren't copyrightable; verbatim banner text is).
- **Human-review until precision is proven**, then sample-audit.
- **"Free LLM" reality check:** free tiers (e.g., Groq/Gemini free, or local via Ollama) are fine for *batch* extraction with review. Don't make an unreliable/free model a *live* dependency. Pick the actual model/provider when you build Phase 2 — record it as a decision in [06](06-decisions-and-open-questions.md). For extraction quality vs cost, evaluate a couple of small models head-to-head on a labeled sample before committing.
- **RAG chat** is a Phase-4+ feature, built on the *clean structured* dataset, not raw scrapes. It is not the first interface.

## Security & privacy (baseline, from day one)
- **Never store real card numbers.** Users select card *types* (bank/network/tier) only. This keeps you far away from PCI scope.
- Minimal PII. If/when accounts exist (Phase 3 wallet), store only what's needed; hash/secure credentials; consider passwordless.
- Secrets in a manager (not in repo). HTTPS everywhere. Rate-limit public API.
- Per-offer disclaimer: bank's official T&Cs are authoritative; we present best-effort normalized info.

## Repo / project structure (proposed monorepo)
```
bank-discounts-pk/
├─ docs/                 # this plan
├─ frontend/             # Next.js app (Vercel)
├─ backend/              # FastAPI app (serving + admin API)
│  ├─ app/
│  ├─ models/            # SQLAlchemy + Pydantic schemas
│  └─ alembic/           # migrations
├─ ingestion/            # scrapers + extraction + normalization pipeline
│  ├─ sources/           # one module per bank
│  ├─ extract/           # html/pdf/image/llm extractors
│  └─ pipeline.py
├─ infra/                # Dockerfiles, deploy config, IaC later
└─ data/                 # seed/sample data, schema fixtures
```
Monorepo keeps the shared schema honest across backend and ingestion. Split later only if teams/deploys demand it.
