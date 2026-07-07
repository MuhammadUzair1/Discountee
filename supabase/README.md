# Supabase

Discountee uses **Supabase** (managed Postgres + auto-generated REST/Realtime APIs
+ Auth + Storage) as its backend. There is **no hand-written CRUD service**:

- **Frontend** reads offers/banks directly with `@supabase/supabase-js` using the
  **anon** key, behind Row-Level Security (public read-only).
- **Ingestion** (Python scrapers, scheduled by Airflow) writes using the
  **service-role** key, which bypasses RLS.

```
supabase/
├─ migrations/0001_init.sql   # schema + RLS policies
└─ seed.sql                   # sample data (mirrors the frontend mock)
```

## Option A — Hosted project (fastest)
1. Create a project at https://supabase.com (free tier is fine).
2. In the dashboard: **SQL Editor** → paste and run `migrations/0001_init.sql`,
   then `seed.sql`.
3. **Project Settings → API** → copy the **Project URL** and **anon public** key.
4. Put them in `frontend/.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
5. Restart `npm run dev`. The app now reads live data from Supabase.

## Option B — Local dev (Supabase CLI + Docker)
Requires Docker running and the [Supabase CLI](https://supabase.com/docs/guides/cli).
```bash
supabase init          # once, if supabase/config.toml doesn't exist yet
supabase start         # spins up local Postgres, API, Studio
supabase db reset      # applies migrations/ + seed.sql
```
`supabase start` prints a local API URL and anon key — use those in `.env.local`.

## Security model
- Anon key is safe to ship to the browser: RLS grants **read-only** on
  `banks`, `merchants`, `offers`. No writes possible with it.
- The **service-role** key is secret — it lives only in the ingestion
  environment (Airflow), never in the frontend.
