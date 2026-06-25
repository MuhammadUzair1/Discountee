# Infra — local development

## Local database (PostgreSQL + PostGIS) and Redis

Requires Docker Desktop.

```bash
cd infra
docker compose up -d        # start Postgres (PostGIS) + Redis
docker compose ps           # check health
docker compose down         # stop (data persists in ./.volumes)
docker compose down -v      # stop and WIPE data
```

- Postgres: `localhost:5432`, db `bankdiscounts`, user/pass `postgres`/`postgres`
- Redis: `localhost:6379`

The connection string matches `backend/.env.example`:
`postgresql+psycopg://postgres:postgres@localhost:5432/bankdiscounts`

PostGIS extension: enable once per database with `CREATE EXTENSION IF NOT EXISTS postgis;`
(this will be wired into the first Alembic migration).

> `.volumes/` is git-ignored — it holds local database files only.

## Production (later)
Frontend → Vercel. Backend → single container on a managed PaaS (Railway/Render/Fly) or
AWS App Runner / ECS Fargate. Managed Postgres (RDS/Supabase/Neon). See
[../docs/03-technical-architecture.md](../docs/03-technical-architecture.md).
