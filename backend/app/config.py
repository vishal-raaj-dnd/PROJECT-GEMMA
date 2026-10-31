import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables and .env file.
    """
    # API Credentials & Model
    gemma_api_key: str = ""
    gemma_model: str = "gemma-4-26b-a4b-it"

    # Filesystem Directories
    okf_storage_dir: str = "./data/okf_bundle"
    raw_docs_dir: str = "./data/raw_docs"

    # Server Networking
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"
    log_level: str = "INFO"

    # Security & Safety
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    strict_safety_gate: bool = True

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> List[str]:
        """Returns parsed list of CORS origins."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def resolved_okf_dir(self) -> Path:
        """Returns the resolved absolute path for the OKF storage bundle."""
        raw_path = Path(self.okf_storage_dir)
        if raw_path.is_absolute() and raw_path.exists() and any(raw_path.glob("**/*.md")):
            return raw_path

        candidates = [
            Path.cwd() / "backend" / "data" / "okf_bundle",
            Path.cwd() / "data" / "okf_bundle",
            Path(__file__).parent.parent / "data" / "okf_bundle",
            Path.cwd() / raw_path,
        ]
        for c in candidates:
            if c.exists() and any(c.glob("**/*.md")):
                return c

        target = Path.cwd() / "backend" / "data" / "okf_bundle"
        target.mkdir(parents=True, exist_ok=True)
        return target

    @property
    def resolved_raw_docs_dir(self) -> Path:
        """Returns the resolved absolute path for uploaded raw documents."""
        raw_path = Path(self.raw_docs_dir)
        candidates = [
            Path.cwd() / "backend" / "data" / "raw_docs",
            Path.cwd() / "data" / "raw_docs",
            Path(__file__).parent.parent / "data" / "raw_docs",
            Path.cwd() / raw_path,
        ]
        for c in candidates:
            if c.exists():
                return c

        target = Path.cwd() / "backend" / "data" / "raw_docs"
        target.mkdir(parents=True, exist_ok=True)
        return target


settings = Settings()
