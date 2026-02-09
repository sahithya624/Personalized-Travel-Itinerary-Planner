"""Database connection and initialization."""

import logging
from supabase import create_client, Client
from app.config import get_settings

logger = logging.getLogger(__name__)


class Database:
    """Supabase database client wrapper."""

    def __init__(self):
        """Initialize Supabase client."""
        settings = get_settings()
        self.client: Client = create_client(
            settings.supabase_url,
            settings.supabase_key
        )
        self.service_client: Client = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )

    def get_client(self) -> Client:
        """Get Supabase client."""
        return self.client

    def get_service_client(self) -> Client:
        """Get service role client for admin operations."""
        return self.service_client


# Global database instance
db: Database | None = None


def init_db() -> Database:
    """Initialize and return database instance."""
    global db
    if db is None:
        db = Database()
        logger.info("Database initialized successfully")
    return db


def get_db() -> Database:
    """Get database instance."""
    global db
    if db is None:
        db = init_db()
    return db
