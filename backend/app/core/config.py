from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_PROMPTS_DIR = Path(__file__).resolve().parents[3] / "ai" / "prompts"


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

    ollama_base_url: str = "http://localhost:11434"
    ollama_chat_model: str = "llama3.2:3b"
    ollama_embed_model: str = "nomic-embed-text"
    ollama_vision_model: str = "qwen2.5vl:3b"
    ollama_connect_timeout_s: float = 5
    ollama_read_timeout_s: float = 180
    ollama_keep_alive: str = "30m"

    chat_context_tokens: int = 4096
    chat_max_new_tokens: int = 700
    chat_temperature: float = 0.3
    chat_history_messages: int = 6

    vision_read_timeout_s: float = 420
    vision_keep_alive: str = "5m"
    vision_context_tokens: int = 4096
    vision_max_new_tokens: int = 600

    max_upload_bytes: int = 5 * 1024 * 1024
    max_image_pixels: int = 25_000_000
    image_max_side: int = 1024

    embed_query_prefix: str = "search_query: "
    embed_document_prefix: str = "search_document: "
    rag_top_k: int = 4
    rag_min_score: float = 0.45

    prompts_dir: Path = DEFAULT_PROMPTS_DIR


@lru_cache
def get_settings() -> Settings:
    return Settings()