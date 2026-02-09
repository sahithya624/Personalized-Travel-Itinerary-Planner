# Backend - Travel Itinerary Planner

FastAPI backend for the AI-powered travel itinerary planner.

## Quick Start

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python -m uvicorn app.main:app --reload
```

## Structure

- `app/main.py` - FastAPI application entry point
- `app/routes/` - API route handlers
- `app/services/` - Business logic and AI orchestration
- `app/schemas/` - Pydantic request/response models
- `app/db/` - Database connections
- `app/prompts/` - LLM prompt templates
- `app/utils/` - Utilities and error handling

## Configuration

See `.env.example` for all configuration options.

Key variables:
- `SUPABASE_URL` - Your Supabase project URL
- `GROQ_API_KEY` - Groq API key for AI generation
- `SECRET_KEY` - JWT secret key (change in production!)

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /trips` - Create trip
- `GET /trips` - List trips
- `GET /trips/{id}` - Get trip details
- `POST /trips/{id}/generate-itinerary` - Generate AI itinerary

See [API.md](../API.md) for full documentation.

## Environment Setup

### Supabase
1. Create project at https://supabase.com
2. Run schema from `database/schema.sql`
3. Get URL and keys from Settings → API

### Groq (Recommended)
1. Get API key at https://console.groq.com
2. Set `GROQ_API_KEY` in `.env`

### Alternative Providers
- HuggingFace: `AI_PROVIDER=huggingface`
- Ollama: `AI_PROVIDER=ollama` (local)

## Development

```bash
# Start with auto-reload
python -m uvicorn app.main:app --reload

# View API docs
curl http://localhost:8000/docs

# Health check
curl http://localhost:8000/health
```

## Dependencies

See `requirements.txt` for all dependencies.

Key packages:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `supabase` - Database client
- `pydantic` - Data validation
- `python-jose` - JWT tokens
- `groq` - Groq API client

## Production

See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

Key checklist:
- [ ] Set `DEBUG=False`
- [ ] Generate strong `SECRET_KEY`
- [ ] Configure CORS
- [ ] Set up error logging
- [ ] Enable database backups
- [ ] Monitor API usage
