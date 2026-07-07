from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment / .env file."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Discountee API"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    # Comma-separated list of allowed CORS origins (frontend dev server by default).
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3100"

    # Database connection string.
    #   Dev default: a local SQLite file (zero infra, runs anywhere).
    #   Production: set DATABASE_URL to Postgres, e.g.
    #     postgresql+psycopg://postgres:postgres@localhost:5432/discountee
    DATABASE_URL: str = "sqlite:///./discountee.db"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def is_sqlite(self) -> bool:
        return self.DATABASE_URL.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
