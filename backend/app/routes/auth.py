"""Authentication routes."""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
)
from app.services.user import get_user_service
from app.utils.auth import get_current_user_id
from app.utils.errors import ValidationError, AuthenticationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
async def register(request: UserRegisterRequest):
    """Register a new user."""
    try:
        user_service = get_user_service()
        user = await user_service.register_user(request)
        return user
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.message)
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest):
    """Authenticate user and return JWT token."""
    try:
        user_service = get_user_service()
        token = await user_service.login_user(request)
        return token
    except AuthenticationError as e:
        raise HTTPException(status_code=401, detail=e.message)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """Get current user info."""
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_service = get_user_service()
        user = await user_service.get_user(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="User not found")
