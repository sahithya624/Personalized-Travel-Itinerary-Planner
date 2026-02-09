# Travel Itinerary Planner - Full Stack GenAI Application

A production-ready AI-powered travel planning platform that generates personalized day-by-day itineraries using advanced language models and prompt engineering.

## 🌟 Key Features

- **AI-Powered Itinerary Generation**: Uses free/open LLMs (Groq, HuggingFace, Ollama) to create personalized travel plans
- **Smart Route Optimization**: Minimizes travel time between locations while maximizing experiences
- **Budget Tracking**: Real-time cost estimation and budget optimization
- **Personalized Recommendations**: Deep personalization based on travel style, interests, and constraints
- **Beautiful Modern UI**: Premium, responsive design with smooth animations
- **User Authentication**: Secure JWT-based auth with Supabase
- **Trip Management**: Create, save, edit, and share itineraries
- **Export Functionality**: Download itineraries as PDF/text

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)               │
│  ├─ Landing Page                                        │
│  ├─ Authentication (Login/Register)                    │
│  ├─ Dashboard (Trip Management)                        │
│  ├─ Trip Builder (Multi-step Form)                     │
│  └─ Itinerary Viewer (Day-by-day breakdown)            │
│  Deployment: Vercel                                     │
└─────────────────────────────────────────────────────────┘
                            ↕ (Axios HTTP)
┌─────────────────────────────────────────────────────────┐
│              Backend (Python FastAPI)                    │
│  ├─ /auth/* - Authentication endpoints                 │
│  ├─ /trips/* - Trip CRUD operations                    │
│  ├─ Itinerary Generation Service                       │
│  ├─ AI Orchestration Layer (Groq/HF/Ollama)           │
│  └─ Prompt Engineering Pipeline                        │
│  Deployment: Render                                     │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│           Database (Supabase PostgreSQL)                │
│  ├─ Users & Authentication                             │
│  ├─ Trips & Itineraries                               │
│  ├─ User Preferences                                   │
│  ├─ Saved Places & History                            │
│  └─ Feedback & Analytics                              │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│           AI Models (Free/Open Source)                   │
│  ├─ Groq (Mixtral-8x7b) - Recommended                 │
│  ├─ HuggingFace Inference API (Mistral)               │
│  └─ Ollama Local Models (Fallback)                    │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **Zustand** - State management

### Backend
- **Python 3.9+** - Runtime
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Supabase** - Database & auth
- **Groq/HuggingFace** - LLM providers
- **Python-jose** - JWT auth

### Database
- **Supabase PostgreSQL** - Primary database
- **Row-Level Security** - Data privacy

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase (managed)

## 📁 Project Structure

```
Personalized Travel Itinerary Planner/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Configuration management
│   │   ├── routes/
│   │   │   ├── auth.py          # Authentication endpoints
│   │   │   └── trips.py         # Trip management endpoints
│   │   ├── services/
│   │   │   ├── ai.py            # AI orchestration
│   │   │   ├── user.py          # User service
│   │   │   └── trip.py          # Trip service
│   │   ├── schemas/
│   │   │   └── schemas.py       # Pydantic models
│   │   ├── prompts/
│   │   │   └── templates.py     # Prompt templates
│   │   ├── utils/
│   │   │   ├── auth.py          # Auth utilities
│   │   │   └── errors.py        # Error handling
│   │   └── db/
│   │       └── database.py      # Database setup
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # App entry point
│   │   ├── index.css            # Global styles
│   │   ├── pages/
│   │   │   ├── Landing.jsx      # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Register page
│   │   │   ├── Dashboard.jsx    # Trip dashboard
│   │   │   ├── CreateTrip.jsx   # Trip creator
│   │   │   └── TripView.jsx     # Itinerary viewer
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── store/
│   │   │   └── store.js         # Zustand store
│   │   ├── hooks/
│   │   │   └── useAuth.js       # Auth hook
│   │   └── layouts/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── database/
│   └── schema.sql               # PostgreSQL schema
├── docs/
│   ├── API.md                   # API documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   └── SETUP.md                 # Setup instructions
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (via Supabase)
- API keys for AI providers (Groq recommended)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with API URL

# Run development server
npm run dev
```

### Database Setup

1. Create Supabase project at https://supabase.com
2. Navigate to SQL Editor
3. Run the schema from `database/schema.sql`
4. Configure RLS policies (included in schema)
5. Get your API keys and update `.env` files

## 🔐 Environment Configuration

### Backend (.env)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

AI_PROVIDER=groq
GROQ_API_KEY=your-groq-key

DEBUG=True
ENVIRONMENT=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000
```

## 📊 Database Schema

### Key Tables
- **users**: User accounts and authentication
- **trips**: Trip metadata and preferences
- **itineraries**: Generated day-by-day plans
- **saved_places**: User-saved locations
- **preferences**: User settings and preferences
- **history**: Activity logs
- **feedback**: User ratings and feedback

## 🤖 AI Integration

### Supported Providers
1. **Groq** (Recommended - Free tier available)
   - Model: Mixtral-8x7b
   - Fast inference, good quality
   
2. **HuggingFace Inference API**
   - Model: Mistral-7B
   - Free tier with rate limits
   
3. **Ollama** (Local)
   - Run models locally
   - No API limits

### Prompt Engineering
- System prompt: Expert travel planner personality
- User prompt: Personalized based on preferences
- Context: Budget, group size, pace, interests
- Output: Structured day-by-day itinerary

## 🔑 Core API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Trips
- `POST /trips` - Create trip
- `GET /trips` - List user trips
- `GET /trips/{id}` - Get trip details
- `DELETE /trips/{id}` - Delete trip

### Itineraries
- `POST /trips/{id}/generate-itinerary` - Generate itinerary
- `GET /trips/{id}/itinerary` - Get itinerary

## 🎨 UI/UX Highlights

- Clean, modern design with gradient backgrounds
- Smooth animations with Framer Motion
- Responsive mobile-first layout
- Dark/light mode support
- Real-time loading states
- Toast notifications for feedback
- Accessible forms and navigation

## 📈 Performance Optimizations

- Code splitting with lazy loading
- Database query optimization with indexes
- Caching strategies for API responses
- Async/await for non-blocking operations
- Optimized bundle size with Vite

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Row-level security in PostgreSQL
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention

## 📱 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Auto-deploy on push

### Backend (Render)
1. Push to GitHub
2. Create new Web Service on Render
3. Configure environment
4. Deploy

### Database (Supabase)
- Managed PostgreSQL
- Auto backups
- Real-time updates

## 🧪 Testing

```bash
# Backend tests (to add)
pytest

# Frontend tests (to add)
npm run test
```

## 📚 Additional Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Setup Instructions](./docs/SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Groq for free tier LLM access
- Supabase for database infrastructure
- Vercel and Render for hosting
- React, FastAPI, and open-source communities

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for travelers and AI enthusiasts**
