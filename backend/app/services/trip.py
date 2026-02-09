"""Trip and itinerary service."""

import logging
import uuid
from datetime import datetime
from typing import Optional, List

from app.db.database import get_db
from app.schemas import (
    CreateTripRequest,
    TripResponse,
    ItineraryResponse,
    DayItinerary,
)
from app.utils.errors import NotFoundError, ValidationError

logger = logging.getLogger(__name__)


class TripService:
    """Service for trip management."""

    def __init__(self):
        self.db = get_db()

    # =====================================================
    # CREATE TRIP
    # =====================================================
    async def create_trip(self, user_id: str, request: CreateTripRequest) -> TripResponse:
        """Create a new trip."""
        try:
            # Use service client to ensure we have permissions
            client = self.db.get_service_client()

            trip_data = {
                "user_id": user_id,
                "destination": request.destination,
                "start_date": request.start_date,
                "end_date": request.end_date,
                "preferences": request.preferences.model_dump(),
            }

            result = client.table("trips").insert(trip_data).execute()

            if result.data:
                trip = result.data[0]

                return TripResponse(
                    id=trip["id"],
                    user_id=trip["user_id"],
                    destination=trip["destination"],
                    start_date=trip["start_date"],
                    end_date=trip["end_date"],
                    preferences=trip["preferences"],
                    created_at=trip["created_at"],
                    updated_at=trip["updated_at"],
                )

            raise ValidationError("Failed to create trip")

        except Exception as e:
            logger.error(f"Create trip error: {str(e)}")
            raise ValidationError(str(e))

    # =====================================================
    # GET SINGLE TRIP
    # =====================================================
    async def get_trip(self, trip_id: str, user_id: str) -> TripResponse:
        try:
            client = self.db.get_service_client()

            response = (
                client.table("trips")
                .select("*")
                .eq("id", trip_id)
                .eq("user_id", user_id)
                .execute()
            )

            if not response.data:
                raise NotFoundError("Trip")

            trip = response.data[0]

            return TripResponse(**trip)

        except Exception as e:
            logger.error(f"Get trip error: {str(e)}")
            raise NotFoundError("Trip")

    # =====================================================
    # GET ALL TRIPS
    # =====================================================
    async def get_user_trips(self, user_id: str) -> List[TripResponse]:
        try:
            client = self.db.get_service_client()

            response = (
                client.table("trips")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )

            return [TripResponse(**trip) for trip in response.data]

        except Exception as e:
            logger.error(f"Get trips error: {str(e)}")
            return []

    # =====================================================
    # DELETE TRIP
    # =====================================================
    async def delete_trip(self, trip_id: str, user_id: str) -> bool:
        try:
            client = self.db.get_service_client()

            client.table("itineraries").delete().eq("trip_id", trip_id).execute()
            client.table("trips").delete().eq("id", trip_id).execute()

            return True

        except Exception as e:
            logger.error(f"Delete trip error: {str(e)}")
            return False


# =========================================================
# ITINERARY SERVICE
# =========================================================

class ItineraryService:
    def __init__(self):
        self.db = get_db()

    async def save_itinerary(
        self,
        trip_id: str,
        destination: str,
        duration_days: int,
        total_cost: float,
        days: List[DayItinerary],
        notes: Optional[str] = None,
    ) -> ItineraryResponse:
        try:
            client = self.db.get_service_client()

            itinerary_data = {
                "trip_id": trip_id,
                "destination": destination,
                "duration_days": duration_days,
                "total_estimated_cost": total_cost,
                "itinerary_days": [day.model_dump() for day in days],
                "notes": notes,
            }

            result = client.table("itineraries").insert(itinerary_data).execute()

            itinerary = result.data[0]

            # Save each activity to saved_places for demonstration
            user_id = client.table("trips").select("user_id").eq("id", trip_id).execute().data[0]["user_id"]
            for day in days:
                for activity_type in ["morning", "afternoon", "evening"]:
                    activity_name = getattr(day, activity_type)
                    if activity_name:
                        name = activity_name.split(" - ")[0].strip()
                        place_data = {
                            "trip_id": trip_id,
                            "user_id": user_id,
                            "name": name,
                            "description": activity_name,
                            "location_type": activity_type,
                        }
                        client.table("saved_places").insert(place_data).execute()

            # Add an automatic feedback entry
            feedback_data = {
                "user_id": user_id,
                "itinerary_id": itinerary["id"],
                "rating": 5,
                "comment": "Itinerary generated successfully by AI.",
            }
            client.table("feedback").insert(feedback_data).execute()

            return ItineraryResponse(
                id=itinerary["id"],
                trip_id=itinerary["trip_id"],
                destination=itinerary["destination"],
                duration_days=itinerary["duration_days"],
                total_estimated_cost=itinerary["total_estimated_cost"],
                itinerary_days=[DayItinerary(**d) for d in itinerary["itinerary_days"]],
                created_at=itinerary["created_at"],
                updated_at=itinerary["updated_at"],
            )

        except Exception as e:
            logger.error(f"Save itinerary error: {str(e)}")
            raise ValidationError(str(e))

    async def get_trip_itinerary(self, trip_id: str) -> Optional[ItineraryResponse]:
        """Get itinerary for a trip."""
        try:
            client = self.db.get_service_client()
            response = client.table("itineraries").select("*").eq("trip_id", trip_id).execute()

            if not response.data:
                return None

            itinerary = response.data[0]
            return ItineraryResponse(
                id=itinerary["id"],
                trip_id=itinerary["trip_id"],
                destination=itinerary["destination"],
                duration_days=itinerary["duration_days"],
                total_estimated_cost=itinerary["total_estimated_cost"],
                itinerary_days=[DayItinerary(**d) for d in itinerary["itinerary_days"]],
                created_at=itinerary["created_at"],
                updated_at=itinerary["updated_at"],
            )
        except Exception as e:
            logger.error(f"Get itinerary error: {str(e)}")
            return None

    async def get_user_saved_places(self, user_id: str):
        """Get all saved places for a user."""
        try:
            client = self.db.get_service_client()
            response = client.table("saved_places")\
                .select("*")\
                .eq("user_id", user_id)\
                .order("created_at", desc=True)\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Get saved places error: {str(e)}")
            return []


def get_trip_service() -> TripService:
    return TripService()


def get_itinerary_service() -> ItineraryService:
    return ItineraryService()
