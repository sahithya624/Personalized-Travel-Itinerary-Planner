# API Documentation

## Travel Itinerary Planner - REST API

Complete API reference for the Travel Itinerary Planner backend.

## Base URL
```
Production: https://travel-planner-api.onrender.com
Development: http://localhost:8000
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

Tokens are obtained from the login endpoint and expire after 24 hours.

---

## Endpoints

### 1. Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-02-08T10:00:00Z"
}
```

**Errors**:
- 422: Email already exists or invalid data

---

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user_id": "uuid"
}
```

**Errors**:
- 401: Invalid credentials

---

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2024-02-08T10:00:00Z"
}
```

**Errors**:
- 401: Not authenticated

---

### 2. Trips

#### Create Trip
```http
POST /trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": "Paris",
  "start_date": "2024-03-15",
  "end_date": "2024-03-22",
  "preferences": {
    "travel_style": "cultural",
    "interests": ["history", "art", "food"],
    "group_size": 2,
    "pace": "moderate",
    "budget_per_day_usd": 150.00,
    "dietary_restrictions": ["vegetarian"],
    "mobility_concerns": null
  }
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "destination": "Paris",
  "start_date": "2024-03-15",
  "end_date": "2024-03-22",
  "preferences": {
    "travel_style": "cultural",
    "interests": ["history", "art", "food"],
    "group_size": 2,
    "pace": "moderate",
    "budget_per_day_usd": 150.00,
    "dietary_restrictions": ["vegetarian"],
    "mobility_concerns": null
  },
  "created_at": "2024-02-08T10:00:00Z",
  "updated_at": "2024-02-08T10:00:00Z"
}
```

**Errors**:
- 422: Validation error
- 500: Server error

---

#### List All Trips
```http
GET /trips
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "destination": "Paris",
    "start_date": "2024-03-15",
    "end_date": "2024-03-22",
    "preferences": {...},
    "created_at": "2024-02-08T10:00:00Z",
    "updated_at": "2024-02-08T10:00:00Z"
  }
]
```

---

#### Get Trip Details
```http
GET /trips/{trip_id}
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "destination": "Paris",
  "start_date": "2024-03-15",
  "end_date": "2024-03-22",
  "preferences": {...},
  "created_at": "2024-02-08T10:00:00Z",
  "updated_at": "2024-02-08T10:00:00Z"
}
```

**Errors**:
- 404: Trip not found

---

#### Delete Trip
```http
DELETE /trips/{trip_id}
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Trip deleted successfully"
}
```

**Errors**:
- 404: Trip not found

---

### 3. Itineraries

#### Generate Itinerary
Generates an AI-powered itinerary for a trip using Groq/HuggingFace/Ollama.

```http
POST /trips/{trip_id}/generate-itinerary
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "destination": "Paris",
  "duration_days": 7,
  "total_estimated_cost": 1050.00,
  "itinerary_days": [
    {
      "day": 1,
      "date": "2024-03-15",
      "morning": "Arrive at Charles de Gaulle airport. Take RER B train to hotel (€12). Check in and rest.",
      "afternoon": "Explore Le Marais district. Visit Place des Vosges (free). Walk along Rue de Rivoli.",
      "evening": "Dinner at L'As du Fallafel on Rue des Rosiers (€15). Walk along Seine.",
      "food_recommendations": "L'As du Fallafel (Falafel, €15), Merci Café (French, €20), Breizh Café (Crêpes, €12)",
      "accommodation_info": "Stay in Le Marais or Latin Quarter. Budget hotels €60-80/night",
      "transport_tips": "Buy Paris Visite pass (€12.85 for 1-day unlimited Metro). Taxis cost €15-20.",
      "estimated_cost_usd": 150.00
    },
    ...
  ],
  "notes": "Generated on 2024-02-08T10:00:00Z",
  "created_at": "2024-02-08T10:00:00Z",
  "updated_at": "2024-02-08T10:00:00Z"
}
```

**Response Fields**:
- `id`: Unique itinerary ID
- `trip_id`: Associated trip ID
- `destination`: Trip destination
- `duration_days`: Number of days
- `total_estimated_cost`: Total cost in USD
- `itinerary_days`: Array of day itineraries (see structure below)

**Day Itinerary Structure**:
- `day`: Day number (1-indexed)
- `date`: Date in YYYY-MM-DD format
- `morning`: Morning activities with venue names and timing
- `afternoon`: Afternoon activities
- `evening`: Evening activities
- `food_recommendations`: Restaurant recommendations with cuisine type and budget
- `accommodation_info`: Recommended neighborhoods and accommodation type
- `transport_tips`: Transit information and costs
- `estimated_cost_usd`: Estimated cost for the day

**Errors**:
- 404: Trip not found
- 500: AI generation failed
- 422: Invalid trip data

---

#### Get Itinerary
Retrieves the most recent itinerary for a trip.

```http
GET /trips/{trip_id}/itinerary
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": "uuid",
  "trip_id": "uuid",
  "destination": "Paris",
  "duration_days": 7,
  "total_estimated_cost": 1050.00,
  "itinerary_days": [...],
  "created_at": "2024-02-08T10:00:00Z",
  "updated_at": "2024-02-08T10:00:00Z"
}
```

**Errors**:
- 404: Itinerary not found

---

## Data Types

### Travel Styles
- `luxury` - High-end experiences
- `backpacking` - Budget-conscious travel
- `cultural` - Historical and cultural focus
- `adventure` - Active outdoor experiences
- `romantic` - Couples' experiences

### Interests
- `food` - Dining and culinary experiences
- `history` - Historical sites and museums
- `nature` - Parks, hiking, outdoor activities
- `shopping` - Shopping and markets
- `art` - Art galleries and museums
- `nightlife` - Bars, clubs, entertainment
- `museums` - Museums and cultural venues
- `beaches` - Beach and water activities
- `hiking` - Mountain and trail activities

### Travel Paces
- `relaxed` - 1-2 activities per day
- `moderate` - 2-3 activities per day
- `fast` - 3+ activities per day

### Dietary Restrictions
- `vegetarian`
- `vegan`
- `gluten-free`
- `halal`
- `kosher`
- `dairy-free`

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message",
  "error_code": "ERROR_TYPE"
}
```

### Error Codes
- `AUTH_ERROR` - Authentication failure
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `AI_ERROR` - AI generation failed
- `APP_ERROR` - General application error

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `422` - Validation error
- `500` - Server error

---

## Rate Limiting

Current implementation doesn't have rate limiting, but in production:
- 100 requests per minute per user
- 10 itinerary generations per hour per user

---

## Examples

### Complete User Flow

**1. Register**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepass123"
  }'
```

**2. Login**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
```

**3. Create Trip**
```bash
curl -X POST http://localhost:8000/trips \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo",
    "start_date": "2024-04-01",
    "end_date": "2024-04-10",
    "preferences": {
      "travel_style": "adventure",
      "interests": ["food", "nature", "shopping"],
      "group_size": 1,
      "pace": "moderate",
      "budget_per_day_usd": 100
    }
  }'
```

**4. Generate Itinerary**
```bash
curl -X POST http://localhost:8000/trips/<trip_id>/generate-itinerary \
  -H "Authorization: Bearer <token>"
```

**5. Get Itinerary**
```bash
curl -X GET http://localhost:8000/trips/<trip_id>/itinerary \
  -H "Authorization: Bearer <token>"
```

---

## SDK Integration

### JavaScript/Frontend
```javascript
import { tripsAPI, authAPI } from './services/api'

// Login
const response = await authAPI.login({ email, password })
localStorage.setItem('token', response.data.access_token)

// Create trip
const trip = await tripsAPI.createTrip(tripData)

// Generate itinerary
const itinerary = await tripsAPI.generateItinerary(trip.id)
```

### Python/Backend
```python
import requests

API_URL = "http://localhost:8000"

# Login
response = requests.post(f"{API_URL}/auth/login", json={
    "email": "user@example.com",
    "password": "password"
})
token = response.json()['access_token']

# Create trip
headers = {"Authorization": f"Bearer {token}"}
trip = requests.post(f"{API_URL}/trips", json=trip_data, headers=headers)
```

---

## Changelog

### v1.0.0 (2024-02-08)
- Initial release
- Authentication endpoints
- Trip CRUD endpoints
- Itinerary generation with AI
- Support for multiple LLM providers

---

## Contact & Support

For API issues or questions, check the logs and error messages:
- Backend logs: Render dashboard
- Database logs: Supabase dashboard
- Frontend errors: Browser console

For feature requests or bugs, create an issue on GitHub.
