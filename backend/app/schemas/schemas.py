"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, EmailStr, Field, ConfigDict, AliasChoices
from datetime import datetime
from typing import Optional, List


# ============ Authentication Schemas ============

class UserRegisterRequest(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)


class UserLoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user_id: str


class UserResponse(BaseModel):
    """User response."""
    id: str
    email: str
    name: str
    created_at: datetime


# ============ Trip & Itinerary Schemas ============

class TripPreferences(BaseModel):
    """Trip preferences."""
    travel_style: str = Field(..., description="luxury, backpacking, cultural, adventure, romantic")
    interests: List[str] = Field(..., description="food, history, nature, shopping, art, nightlife, etc.")
    group_size: int = Field(..., ge=1, le=20)
    pace: str = Field(..., description="relaxed, moderate, fast")
    budget_per_day_inr: float = Field(..., validation_alias=AliasChoices("budget_per_day_inr", "budget_per_day_usd"))
    dietary_restrictions: Optional[List[str]] = None
    mobility_concerns: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class CreateTripRequest(BaseModel):
    """Create trip request."""
    user_id: Optional[str] = None
    destination: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    preferences: TripPreferences


class DayItinerary(BaseModel):
    """Single day itinerary."""
    day: int
    date: str
    morning: str
    afternoon: str
    evening: str
    food_recommendations: str
    accommodation_info: str
    transport_tips: str
    estimated_cost_inr: float = Field(0.0, validation_alias=AliasChoices("estimated_cost_inr", "estimated_cost_usd"))

    model_config = ConfigDict(populate_by_name=True)


class GeneratedItinerary(BaseModel):
    """Complete generated itinerary."""
    id: str
    trip_id: str
    destination: str
    duration_days: int
    total_estimated_cost: float
    itinerary_days: List[DayItinerary]
    notes: Optional[str] = None
    generated_at: datetime


class ItineraryResponse(BaseModel):
    """Itinerary response."""
    id: str
    trip_id: str
    destination: str
    duration_days: int
    total_estimated_cost: float
    itinerary_days: List[DayItinerary]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)


class TripResponse(BaseModel):
    """Trip response."""
    id: str
    user_id: str
    destination: str
    start_date: str
    end_date: str
    preferences: TripPreferences
    itinerary: Optional[ItineraryResponse] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(populate_by_name=True)


class SavedPlace(BaseModel):
    """Saved place/location."""
    id: str
    trip_id: str
    name: str
    description: str
    location_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    estimated_cost: Optional[float] = None
    website: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response."""
    detail: str
    error_code: Optional[str] = None
