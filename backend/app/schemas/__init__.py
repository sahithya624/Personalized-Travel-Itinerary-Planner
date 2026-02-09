"""Schemas module."""

from app.schemas.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
    TripPreferences,
    CreateTripRequest,
    DayItinerary,
    GeneratedItinerary,
    ItineraryResponse,
    TripResponse,
    SavedPlace,
    ErrorResponse,
)

__all__ = [
    "UserRegisterRequest",
    "UserLoginRequest",
    "TokenResponse",
    "UserResponse",
    "TripPreferences",
    "CreateTripRequest",
    "DayItinerary",
    "GeneratedItinerary",
    "ItineraryResponse",
    "TripResponse",
    "SavedPlace",
    "ErrorResponse",
]
