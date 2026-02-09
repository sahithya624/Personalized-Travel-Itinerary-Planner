# System Architecture & Implementation Guide

## 🏗️ Complete System Architecture

### 1. Frontend Architecture (React + Vite)

#### Component Hierarchy
```
App.jsx (Router)
├── Landing (Public)
├── Register (Public)
├── Login (Public)
└── Dashboard (Protected)
    ├── CreateTrip (Multi-step form)
    └── TripView (Itinerary display)
```

#### State Management Flow
```
User Action → Component → Zustand Store → API Call → Backend
                                    ↓
                            Local Storage
                            (Token & User)
```

#### Data Flow for Itinerary Generation
```
User Input (CreateTrip)
    ↓
Submit Trip Data
    ↓
Save to Database (Supabase)
    ↓
Navigate to TripView
    ↓
Trigger Generate Button
    ↓
API Call: POST /trips/{id}/generate-itinerary
    ↓
Backend Processes (see backend flow)
    ↓
Return Itinerary JSON
    ↓
Display with Animations
    ↓
Allow Export/Edit
```

### 2. Backend Architecture (FastAPI)

#### Request Pipeline
```
HTTP Request
    ↓
FastAPI Router (route matching)
    ↓
CORS Middleware (origin validation)
    ↓
Route Handler
    ↓
Service Layer (business logic)
    ↓
Database/AI Layer
    ↓
Response JSON
    ↓
HTTP Response
```

#### Itinerary Generation Pipeline
```
POST /trips/{trip_id}/generate-itinerary
    ↓
1. Fetch Trip from Database
    ├─ Validate ownership (user_id)
    └─ Get preferences
    ↓
2. Build Prompt
    ├─ System Prompt (expert travel planner)
    └─ User Prompt (personalized template)
    ↓
3. Call AI Provider
    ├─ Groq API (recommended)
    ├─ HuggingFace API (alternative)
    └─ Ollama Local (fallback)
    ↓
4. Parse Response
    ├─ Extract structured data
    └─ Organize into day-by-day format
    ↓
5. Save to Database
    ├─ Create itinerary record
    └─ Store with trip association
    ↓
6. Return Formatted Response
```

#### Service Layer Architecture
```
routes/ (API Handlers)
├── auth.py
│   ├── register()
│   ├── login()
│   └── get_me()
└── trips.py
    ├── create_trip()
    ├── list_trips()
    ├── get_trip()
    ├── delete_trip()
    └── generate_itinerary()

services/ (Business Logic)
├── user.py
│   ├── UserService
│   ├── register_user()
│   ├── login_user()
│   └── get_user()
├── trip.py
│   ├── TripService
│   ├── ItineraryService
│   ├── create_trip()
│   ├── save_itinerary()
│   └── get_itinerary()
└── ai.py
    ├── AIOrchestrator
    ├── LLMProvider (abstract)
    ├── GroqProvider
    ├── HuggingFaceProvider
    ├── OllamaProvider
    ├── generate_itinerary()
    └── parse_response()

utils/ (Helpers)
├── auth.py
│   ├── hash_password()
│   ├── verify_password()
│   ├── create_access_token()
│   └── decode_token()
└── errors.py
    ├── AppException
    ├── ValidationError
    ├── AuthenticationError
    └── AIGenerationError
```

### 3. Database Architecture (Supabase PostgreSQL)

#### Entity Relationship Diagram
```
users (1) ──── (N) trips
  │
  ├── (1) ──── (N) saved_places
  ├── (1) ──── (N) preferences
  ├── (1) ──── (N) history
  └── (1) ──── (N) feedback

trips (1) ──── (N) itineraries
trips (1) ──── (N) saved_places

itineraries (1) ──── (N) feedback
```

#### Table Relationships
```
users
├─ id (PK)
├─ email (UNIQUE)
├─ name
├─ password_hash
├─ created_at
└─ updated_at

trips
├─ id (PK)
├─ user_id (FK → users)
├─ destination
├─ start_date
├─ end_date
├─ preferences (JSONB)
├─ created_at
└─ updated_at

itineraries
├─ id (PK)
├─ trip_id (FK → trips)
├─ destination
├─ duration_days
├─ total_estimated_cost
├─ itinerary_days (JSONB array)
├─ notes
├─ created_at
└─ updated_at

saved_places
├─ id (PK)
├─ trip_id (FK → trips)
├─ user_id (FK → users)
├─ name
├─ description
├─ location_type
├─ latitude/longitude
├─ estimated_cost
├─ website
└─ created_at

preferences
├─ id (PK)
├─ user_id (FK → users, UNIQUE)
├─ theme
├─ notifications_enabled
├─ currency
├─ settings (JSONB)
├─ created_at
└─ updated_at

history
├─ id (PK)
├─ user_id (FK → users)
├─ action
├─ entity_type
├─ entity_id
├─ details (JSONB)
└─ created_at

feedback
├─ id (PK)
├─ user_id (FK → users)
├─ itinerary_id (FK → itineraries)
├─ rating (1-5)
├─ comment
└─ created_at
```

### 4. Authentication Flow

#### Registration
```
User Input (name, email, password)
    ↓
Frontend: POST /auth/register
    ↓
Backend:
  1. Validate input (Pydantic)
  2. Check email uniqueness (query DB)
  3. Hash password (bcrypt)
  4. Create user in DB
  5. Return user data
    ↓
Frontend: Store user info in localStorage
    ↓
Redirect to dashboard
```

#### Login
```
User Input (email, password)
    ↓
Frontend: POST /auth/login
    ↓
Backend:
  1. Validate input
  2. Find user by email
  3. Verify password (bcrypt)
  4. Generate JWT token
  5. Return token
    ↓
Frontend:
  1. Store token in localStorage
  2. Store user in Zustand
    ↓
Add to API headers: Authorization: Bearer {token}
```

#### Protected Requests
```
Frontend API Call
    ↓
Add header: Authorization: Bearer {token}
    ↓
Axios interceptor adds token
    ↓
Backend FastAPI:
  1. Extract token from header
  2. Decode JWT signature
  3. Verify expiration
  4. Extract user_id
    ↓
If valid: Process request
If invalid: Return 401 Unauthorized
    ↓
Frontend: If 401, clear token and redirect to login
```

### 5. Prompt Engineering Strategy

#### Prompt Structure
```
System Prompt
├─ Expert travel planner persona
├─ Personality: Professional, detailed, practical
├─ Goals: Personalize, optimize, avoid generic

User Prompt
├─ Destination & dates
├─ Travel style (luxury/backpacking/cultural/etc.)
├─ Interests (food, history, nature, etc.)
├─ Group composition
├─ Budget constraints
├─ Pace preferences
├─ Special dietary/mobility needs
└─ Output format requirements

Output Format
└─ Day-by-day structure:
    ├─ Morning activities (with venue names, times, costs)
    ├─ Afternoon activities
    ├─ Evening activities
    ├─ Food recommendations (specific restaurants)
    ├─ Accommodation suggestions
    ├─ Transport info (with costs)
    └─ Daily cost breakdown
```

#### Prompt Template Example
```python
SYSTEM_PROMPT = """You are an expert travel planner with 20+ years of experience...
Recommendations are personalized, time-optimized, budget-conscious, and practical."""

USER_PROMPT = """Create a detailed {destination} itinerary from {start_date} to {end_date}

USER PROFILE:
- Travel Style: {travel_style}
- Interests: {interests}
- Group Size: {group_size}
- Daily Budget: ${budget_per_day}
- Pace: {pace}

REQUIREMENTS: [Specific instructions for output format]...
"""
```

### 6. AI Provider Integration

#### Provider Selection Logic
```
Check AI_PROVIDER env variable
    ├─ "groq" → Initialize GroqProvider
    ├─ "huggingface" → Initialize HuggingFaceProvider
    └─ "ollama" → Initialize OllamaProvider

When generating:
    1. Provider receives system + user prompts
    2. Provider calls respective API
    3. Provider returns text response
    4. AIOrchestrator parses response
    5. Response stored in database
```

#### Provider Comparison
```
Groq (Recommended)
├─ Model: Mixtral-8x7b
├─ Speed: ⚡⚡⚡⚡⚡ (fastest)
├─ Quality: ⭐⭐⭐⭐⭐
├─ Cost: Free tier available
└─ Rate limit: Generous

HuggingFace
├─ Model: Mistral-7B
├─ Speed: ⚡⚡⚡⚡
├─ Quality: ⭐⭐⭐⭐
├─ Cost: Free with limits
└─ Rate limit: Moderate

Ollama (Local)
├─ Model: Any (Mistral recommended)
├─ Speed: Depends on hardware
├─ Quality: ⭐⭐⭐⭐
├─ Cost: Free (local compute)
└─ Rate limit: Unlimited
```

### 7. Error Handling Strategy

#### Error Layers
```
Frontend
├─ Try-catch blocks
├─ Axios interceptors
├─ User-friendly messages
├─ Toast notifications
└─ Redirect on 401

API Routes
├─ Validation (Pydantic)
├─ Custom exceptions
├─ HTTP status codes
└─ JSON error responses

Services
├─ Business logic exceptions
├─ Logging
├─ Graceful fallbacks
└─ Data validation

Database
├─ Connection errors
├─ Query failures
├─ Constraint violations
└─ Transaction rollbacks
```

#### Error Response Format
```json
{
  "detail": "User-friendly message",
  "error_code": "SPECIFIC_ERROR_CODE"
}
```

### 8. Performance Optimization

#### Frontend Optimizations
```
Code Splitting
├─ Route-based code splitting
├─ Lazy load heavy components
└─ Optimize bundle size

Caching
├─ Cache API responses
├─ LocalStorage for user state
├─ Service workers for offline

Rendering
├─ Memoized components
├─ Virtual lists for large data
├─ Debounced inputs
└─ Image optimization

Build
├─ Minified production build
├─ Source map generation
└─ Asset compression
```

#### Backend Optimizations
```
Database
├─ Indexed queries (user_id, trip_id, created_at)
├─ Efficient joins
├─ Connection pooling
└─ Query result caching

API
├─ Async/await
├─ Non-blocking I/O
├─ Response compression
└─ Rate limiting

AI
├─ Cache itinerary responses
├─ Batch requests if applicable
├─ Timeout on long responses
└─ Token counting for cost
```

### 9. Security Measures

#### Frontend Security
```
Authentication
├─ JWT tokens in localStorage
├─ Auto-logout on expiration
├─ HTTPS only in production
└─ XSS protection

API Communication
├─ CORS validation
├─ Content-Type checking
└─ Input sanitization
```

#### Backend Security
```
Application
├─ Input validation (Pydantic)
├─ SQL injection prevention
├─ Password hashing (bcrypt)
├─ JWT signature verification

Database
├─ Row-Level Security (RLS)
├─ Parameterized queries
├─ Encrypted connections
└─ Access control policies

Infrastructure
├─ Environment variables for secrets
├─ HTTPS/TLS enforcement
├─ CORS whitelist
└─ API key management
```

### 10. Deployment Architecture

```
GitHub Repository
    ↓
Vercel (Frontend)          Render (Backend)
├─ Auto-deploy on push     ├─ Auto-deploy on push
├─ CDN distribution        ├─ Container runtime
├─ HTTPS                   ├─ Load balancing
└─ Custom domain           └─ Scaling

                ↓
           Supabase
        ├─ PostgreSQL
        ├─ Auto-backups
        ├─ Real-time subscriptions
        └─ RLS enforcement
```

---

## Implementation Checklist

### ✅ Completed
- [x] Project structure created
- [x] Backend FastAPI setup
- [x] Frontend React setup
- [x] Database schema designed
- [x] Authentication system
- [x] Trip management
- [x] AI integration (Groq/HuggingFace/Ollama)
- [x] Prompt engineering
- [x] Itinerary generation
- [x] API endpoints
- [x] UI components
- [x] Error handling
- [x] Documentation

### 📊 Statistics
- Frontend Files: 15+ components/pages
- Backend Files: 20+ modules
- Database Tables: 7 main tables
- API Endpoints: 10+ endpoints
- Documentation Pages: 5 comprehensive guides

---

## Next Steps for Team

1. **Local Development**
   - Follow SETUP.md to set up local environment
   - Run backend and frontend servers
   - Test all features manually

2. **Customization**
   - Modify prompt templates for specific needs
   - Adjust styling in tailwind.config.js
   - Add custom AI models if needed

3. **Testing**
   - Add unit tests with pytest (backend)
   - Add tests with Vitest (frontend)
   - Create integration tests
   - Load testing for AI generation

4. **Deployment**
   - Follow DEPLOYMENT.md
   - Set up monitoring and logging
   - Configure custom domains
   - Enable analytics

5. **Scaling**
   - Add caching layer (Redis)
   - Implement request queuing
   - Scale database as needed
   - Monitor API costs

---

This architecture provides a solid foundation for a production-grade AI-powered travel planning application.
