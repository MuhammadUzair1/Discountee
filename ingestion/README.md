# Ingestion pipeline (Phase 2 — not built yet)

Python scrapers, scheduled by **Apache Airflow**, that write into **Supabase** using the
**service-role** key. Decoupled from the app — they communicate only through Supabase, so
scraper breakage or LLM latency never affects users.

## Tiered fetch → extract → normalize → verify → upsert

```
1. STATIC   httpx + BeautifulSoup (or selectolax)
2. DYNAMIC  Playwright   (prefer capturing the underlying JSON/XHR over DOM scraping)
3. PDF      PyMuPDF (fitz) / pdfplumber / Camelot (tables)
4. IMAGE    OCR (Tesseract) or a multimodal LLM that returns structured fields
   ↓
5. NORMALIZE  LLM with structured output → canonical offer schema (facts, our words)
6. VALIDATE   schema + business rules + human review until precision is proven
7. UPSERT     Supabase (service-role key), with provenance (source_url, confidence);
              raw artifacts (HTML/PDF/image) → Supabase Storage
```

## Planned layout
```
ingestion/
├─ sources/          # one module per bank (fetch + extract)
├─ extract/          # html / pdf / image / llm extractors (shared)
├─ supabase_writer.py# upsert normalized offers into Supabase (service role)
└─ dags/             # Airflow DAGs (schedule the runs)
```

See [../docs/03-technical-architecture.md](../docs/03-technical-architecture.md) for the full
tool evaluation and rationale, and [../docs/01-cto-evaluation-and-risks.md](../docs/01-cto-evaluation-and-risks.md)
for the legal/politeness constraints (robots.txt, rate limits, no auth-walled content,
store facts not verbatim copy).
