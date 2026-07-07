# Backend — FastAPI

Serving API for Discountee. Returns offer/bank data in **camelCase** so it is a
drop-in replacement for the frontend's mock data layer (`frontend/src/lib/api.ts`).

DB-agnostic: **SQLite by default** for zero-infra local dev; point `DATABASE_URL`
at Postgres (PostGIS) for production.

## Layout
```
backend/
├─ app/
│  ├─ main.py            # FastAPI app, CORS, /health
│  ├─ core/config.py     # settings (env-driven, pydantic-settings)
│  ├─ db/                # SQLAlchemy base + session
│  ├─ models/            # ORM models: Bank, Merchant, Offer
│  ├─ schemas.py         # Pydantic schemas (camelCase aliases)
│  ├─ crud.py            # query + filter logic
│  ├─ seed.py            # sample data (mirrors the frontend mock)
│  └─ api/v1/routes/     # health, banks, offers
├─ alembic/             # migrations
├─ requirements.txt
└─ Dockerfile
```

## Run locally
> Use **Python 3.10** (the machine's 3.14 lacks wheels for some deps; 3.12 also fine).
> Run commands from the `backend/` directory.

```powershell
cd backend
py -3.10 -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt

.venv\Scripts\alembic.exe upgrade head     # create tables (SQLite: discountee.db)
.venv\Scripts\python.exe -m app.seed        # load sample data
.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

- Health: http://localhost:8000/health
- Interactive docs (try the endpoints): http://localhost:8000/docs

## Endpoints (`/api/v1`)
| Method | Path | Notes |
|---|---|---|
| GET | `/banks` | all banks |
| GET | `/cities` | distinct cities |
| GET | `/offers` | filters: `bank`, `network`, `tier`, `city`, `vertical`, `q` |
| GET | `/offers/featured?limit=` | top offers by discount |
| GET | `/offers/{id}` | single offer (404 if missing) |

## Switching to Postgres
1. Start the local DB: `cd ../infra && docker compose up -d` (Postgres + PostGIS).
2. Set `DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/discountee"`.
3. `alembic upgrade head` then `python -m app.seed`.

Migrations use `render_as_batch`, so the same Alembic history works on SQLite and Postgres.
