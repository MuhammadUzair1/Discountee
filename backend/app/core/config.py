from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Bank Discounts PK API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    # Comma-separated list of allowed CORS origins (frontend dev server by default).
    CORS_ORIGINS: str = "http://localhost:3000"

    # PostgreSQL (PostGIS-enabled) connection string.
    DATABASE_URL: str = (
        "postgresql+psycopg://postgres:postgres@localhost:5432/bankdiscounts"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
