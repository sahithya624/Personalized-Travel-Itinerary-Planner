"""Utility functions for logging and errors."""

import logging
import json
from typing import Optional
from datetime import datetime


def setup_logging(level: str = "INFO"):
    """Configure application logging."""
    logging.basicConfig(
        level=level,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        error_code: Optional[str] = None,
        status_code: int = 400
    ):
        self.message = message
        self.error_code = error_code or "APP_ERROR"
        self.status_code = status_code
        super().__init__(self.message)

    def to_dict(self) -> dict:
        """Convert exception to dictionary."""
        return {
            "detail": self.message,
            "error_code": self.error_code
        }


class ValidationError(AppException):
    """Validation error."""

    def __init__(self, message: str, error_code: str = "VALIDATION_ERROR"):
        super().__init__(message, error_code, 422)


class AuthenticationError(AppException):
    """Authentication error."""

    def __init__(self, message: str = "Invalid credentials", error_code: str = "AUTH_ERROR"):
        super().__init__(message, error_code, 401)


class NotFoundError(AppException):
    """Resource not found error."""

    def __init__(self, resource: str, error_code: str = "NOT_FOUND"):
        message = f"{resource} not found"
        super().__init__(message, error_code, 404)


class AIGenerationError(AppException):
    """AI generation error."""

    def __init__(self, message: str, error_code: str = "AI_ERROR"):
        super().__init__(message, error_code, 500)


def log_request(user_id: Optional[str], method: str, endpoint: str, data: Optional[dict] = None):
    """Log API request."""
    logger = logging.getLogger(__name__)
    log_data = {
        "timestamp": datetime.now().isoformat(),
        "user_id": user_id,
        "method": method,
        "endpoint": endpoint,
    }
    if data:
        # Don't log sensitive data
        safe_data = data.copy()
        for key in ["password", "token", "api_key"]:
            if key in safe_data:
                safe_data[key] = "***"
        log_data["data"] = safe_data

    logger.info(json.dumps(log_data))
