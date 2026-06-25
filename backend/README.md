# Backend — FastAPI

Serving + admin API for the bank-discount platform. Talks to PostgreSQL (PostGIS).

## Layout
```
backend/
├─ app/
│  ├─ main.py            # FastAPI app, CORS, /health
│  ├─ core/config.py     # settings (env-driven, pydantic-settings)
│  ├─ api/v1/            # versioned API routers
│  │  ├─ router.py       # aggregates v1 routers
│  │  └─ routes/         # one module per resource (health, later: offers, banks...)
│  ├─ db/                # SQLAlchemy base + session
│  └─ models/            # ORM models (added in the data-model phase)
├─ requirements.txt
├─ Dockerfile
└─ .env.example
```

## Run locally (Phase 2+ — frontend comes first)
> Use **Python 3.12** for the smoothest dependency install. The machine's default is 3.14,
> which may lack prebuilt wheels for some libraries. Create the venv with a 3.12 interpreter if available.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env            # then edit values
uvicorn app.main:app --reload --port 8000
```

- Health: http://localhost:8000/health
- Versioned ping: http://localhost:8000/api/v1/ping
- Interactive docs: http://localhost:8000/docs

A local PostGIS database can be started from `../infra` (see `infra/README.md`).
