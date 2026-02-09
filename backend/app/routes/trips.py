"""Trip and itinerary routes."""

import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from app.utils.auth import get_current_user_id
from app.services.history import get_history_service
from app.schemas import (
    CreateTripRequest,
    TripResponse,
    ItineraryResponse,
    DayItinerary,
)
from app.services.trip import get_trip_service, get_itinerary_service
from app.services.ai import get_ai_orchestrator
from app.prompts import (
    SYSTEM_PROMPT,
    build_itinerary_prompt,
)
from app.utils.errors import NotFoundError, ValidationError, AIGenerationError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("", response_model=TripResponse)
async def create_trip(
    request: CreateTripRequest, 
    current_user_id: str = Depends(get_current_user_id)
):
    """Create a new trip."""
    try:
        trip_service = get_trip_service()
        # Fallback to body user_id if we are in demo mode but body has a real ID
        actual_user_id = current_user_id
        if (actual_user_id == "demo-user" or not actual_user_id) and request.user_id:
            actual_user_id = request.user_id
            
        trip = await trip_service.create_trip(actual_user_id, request)
        
        # Log action
        history_service = get_history_service()
        await history_service.log_action(
            user_id=actual_user_id,
            action="CREATE_TRIP",
            entity_type="trip",
            entity_id=trip.id,
            details={"destination": trip.destination}
        )
        
        return trip
    except ValidationError as e:
        logger.warning(f"Validation error creating trip: {e.message}")
        raise HTTPException(status_code=422, detail=e.message)
    except Exception as e:
        logger.exception(f"Unexpected error creating trip: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create trip: {str(e)}")


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Get trip details."""
    try:
        trip_service = get_trip_service()
        trip = await trip_service.get_trip(trip_id, current_user_id)
        return trip
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Trip not found")
    except Exception as e:
        logger.error(f"Get trip error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get trip")


@router.get("", response_model=list[TripResponse])
async def list_trips(current_user_id: str = Depends(get_current_user_id)):
    """List all user trips."""
    try:
        trip_service = get_trip_service()
        trips = await trip_service.get_user_trips(current_user_id)
        return trips
    except Exception as e:
        logger.error(f"List trips error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list trips")


@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Delete a trip."""
    try:
        trip_service = get_trip_service()
        success = await trip_service.delete_trip(trip_id, current_user_id)
        if not success:
            raise HTTPException(status_code=404, detail="Trip not found")
            
        # Log action
        history_service = get_history_service()
        await history_service.log_action(
            user_id=current_user_id,
            action="DELETE_TRIP",
            entity_type="trip",
            entity_id=trip_id
        )
        
        return {"message": "Trip deleted successfully"}
    except Exception as e:
        logger.error(f"Delete trip error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete trip")


@router.post("/{trip_id}/generate-itinerary", response_model=ItineraryResponse)
async def generate_itinerary(trip_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Generate itinerary for a trip."""
    try:
        trip_service = get_trip_service()
        itinerary_service = get_itinerary_service()
        ai_orchestrator = get_ai_orchestrator()

        # Get trip
        trip = await trip_service.get_trip(trip_id, current_user_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        # Build prompt
        user_prompt = build_itinerary_prompt(
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            travel_style=trip.preferences.travel_style,
            interests=trip.preferences.interests,
            group_size=trip.preferences.group_size,
            pace=trip.preferences.pace,
            budget_per_day=trip.preferences.budget_per_day_inr,
            dietary_restrictions=trip.preferences.dietary_restrictions,
            mobility_concerns=trip.preferences.mobility_concerns,
        )

        # Generate itinerary
        logger.info(f"Generating itinerary for trip {trip_id}")
        response_text = await ai_orchestrator.generate_itinerary(SYSTEM_PROMPT, user_prompt)

        # Parse response
        parsed = ai_orchestrator.parse_itinerary_response(response_text)

        # Calculate duration and total cost
        from datetime import datetime as dt
        start = dt.strptime(trip.start_date, "%Y-%m-%d")
        end = dt.strptime(trip.end_date, "%Y-%m-%d")
        duration_days = (end - start).days + 1

        # Create DayItinerary objects
        days = []
        total_cost = 0.0

        if "days" in parsed:
            for day_data in parsed["days"]:
                day_itinerary = DayItinerary(
                    day=day_data.get("day", len(days) + 1),
                    date=trip.start_date,  # Would be computed in real scenario
                    morning=day_data.get("morning", ""),
                    afternoon=day_data.get("afternoon", ""),
                    evening=day_data.get("evening", ""),
                    food_recommendations=day_data.get("food_recommendations", ""),
                    accommodation_info=day_data.get("accommodation_info", ""),
                    transport_tips=day_data.get("transport_tips", ""),
                    estimated_cost_inr=day_data.get("estimated_cost_inr", 0.0),
                )
                days.append(day_itinerary)
                total_cost += day_itinerary.estimated_cost_inr
        else:
            raise ValidationError("Invalid itinerary response format")

        # Save to database
        itinerary = await itinerary_service.save_itinerary(
            trip_id=trip_id,
            destination=trip.destination,
            duration_days=duration_days,
            total_cost=total_cost,
            days=days,
            notes=f"Generated on {datetime.now().isoformat()}",
        )

        # Log action
        history_service = get_history_service()
        await history_service.log_action(
            user_id=current_user_id,
            action="GENERATE_ITINERARY",
            entity_type="itinerary",
            entity_id=itinerary.id,
            details={"trip_id": trip_id, "destination": trip.destination}
        )

        return itinerary

    except AIGenerationError as e:
        logger.error(f"AI generation error for trip {trip_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")
    except ValidationError as e:
        logger.warning(f"Validation error generating itinerary for trip {trip_id}: {e.message}")
        raise HTTPException(status_code=422, detail=e.message)
    except NotFoundError:
        raise HTTPException(status_code=404, detail="Trip not found")
    except Exception as e:
        logger.exception(f"Unexpected error generating itinerary for trip {trip_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@router.get("/{trip_id}/itinerary", response_model=ItineraryResponse)
async def get_itinerary(trip_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Get itinerary for a trip."""
    try:
        itinerary_service = get_itinerary_service()
        itinerary = await itinerary_service.get_trip_itinerary(trip_id)

        if not itinerary:
            raise HTTPException(status_code=404, detail="Itinerary not found")

        return itinerary

    except NotFoundError:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    except Exception as e:
        logger.exception(f"Unexpected error getting itinerary for trip {trip_id}: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Server Error: {type(e).__name__}: {str(e)}"
        )


@router.get("/user/saved-places")
async def get_saved_places(current_user_id: str = Depends(get_current_user_id)):
    """Get all saved places for the user."""
    try:
        itinerary_service = get_itinerary_service()
        places = await itinerary_service.get_user_saved_places(current_user_id)
        return places
    except Exception as e:
        logger.error(f"Error fetching saved places: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch saved places")


@router.get("/user/history")
async def get_history(current_user_id: str = Depends(get_current_user_id)):
    """Get user action history."""
    try:
        history_service = get_history_service()
        history = await history_service.get_user_history(current_user_id)
        return history
    except Exception as e:
        logger.error(f"Error fetching history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")
