# Data

- `seed/` — small, curated, **tracked** datasets used to bootstrap the app (e.g., the
  Phase-0 hand-curated offers that become the MVP's launch content and schema validation).
- `raw/` — raw scraped artifacts (HTML/PDF/images). **Git-ignored.** In production these live
  in object storage (S3); locally they may be cached here for re-processing.
- `cache/` — geocoding / extraction caches. **Git-ignored.**

The canonical offer schema these map into is defined in
[../docs/04-data-model.md](../docs/04-data-model.md).
