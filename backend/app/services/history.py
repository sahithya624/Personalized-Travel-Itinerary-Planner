"""History and audit log service."""

import logging
from typing import Optional, Dict, Any
from app.db.database import get_db

logger = logging.getLogger(__name__)

class HistoryService:
    """Service for managing user action history."""

    def __init__(self):
        self.db = get_db()

    async def log_action(
        self,
        user_id: str,
        action: str,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        """Log a user action to the history table."""
        try:
            client = self.db.get_service_client()
            
            history_data = {
                "user_id": user_id,
                "action": action,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "details": details or {}
            }
            
            client.table("history").insert(history_data).execute()
        except Exception as e:
            logger.error(f"Failed to log history: {str(e)}")

    async def get_user_history(self, user_id: str):
        try:
            client = self.db.get_service_client()
            response = client.table("history")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Failed to fetch history: {str(e)}")
            return []

def get_history_service() -> HistoryService:
    return HistoryService()
