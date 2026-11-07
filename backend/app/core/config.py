from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "NEETBIO API"
    app_version: str = "0.1.0"
    environment: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "neetbio"
    mongodb_timeout_ms: int = 3000

    cors_origins: list[str] = ["http://localhost:5173"]

    secret_key: str = Field(min_length=32)
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440


@lru_cache
def get_settings() -> Settings:
    return Settings()