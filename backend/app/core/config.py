from __future__ import annotations

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 8000
    cors_origins: str = "http://localhost:3000"
    environment: str = "DEVELOPMENT"

    # Database & Redis
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/lexportal"
    redis_url: str = "redis://localhost:6379/0"

    # Security
    encryption_key: str = ""
    secret_key: str = "supersecretkey" # Used for encryption key derivation if encryption_key is empty
    jwt_secret: str = "secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    trusted_ips: List[str] = ["127.0.0.1", "::1"]
    
    # DDoS Protection
    ddos_max_violations: int = 5
    ddos_ban_seconds: int = 900  # 15 minutes
    ddos_window_seconds: int = 300  # 5 minutes
    
    gemini_api_key: str = ""


settings = Settings()
