"""Application configuration and settings."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_service_role_key: str

    # JWT
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # AI Model
    ai_provider: str = "groq"  # groq, huggingface, ollama
    groq_api_key: str | None = None
    huggingface_api_key: str | None = None
    ollama_base_url: str = "http://localhost:11434"

    # Server
    debug: bool = True
    environment: str = "development"
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5173"

    # Redis
    redis_url: str | None = None

    # Logging
    log_level: str = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()
