from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# SQLite needs check_same_thread=False to be used across FastAPI's threadpool.
connect_args = {"check_same_thread": False} if settings.is_sqlite else {}

# pool_pre_ping avoids stale connections after DB restarts / idle periods.
engine = create_engine(
    settings.DATABASE_URL, pool_pre_ping=True, connect_args=connect_args
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a DB session and closes it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
