# Setup Instructions

## Complete Local Development Setup

Follow these steps to set up the Travel Itinerary Planner for local development.

## Prerequisites

### Required Software
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **Python 3.9+** - Download from [python.org](https://www.python.org)
- **Git** - Download from [git-scm.com](https://git-scm.com)
- **Code Editor** - VS Code recommended

### Required Accounts
- **Supabase** - Sign up at [supabase.com](https://supabase.com)
- **Groq** - Get API key at [console.groq.com](https://console.groq.com)
- (Optional) **GitHub** - For version control

---

## Step 1: Clone or Download Project

### Option A: Clone from GitHub
```bash
git clone https://github.com/yourusername/travel-planner.git
cd travel-planner
```

### Option B: Manual Download
Download the project folder and extract it.

---

## Step 2: Set Up Database (Supabase)

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new organization and project
4. Choose a region close to you
5. Wait for project initialization (2-3 minutes)

### 2.2 Get API Keys
1. In Supabase dashboard, go to **Settings → API**
2. Copy these values:
   - `Project URL` → Save as `SUPABASE_URL`
   - `anon public` key → Save as `SUPABASE_KEY`
   - `service_role` key → Save as `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Initialize Database Schema
1. In Supabase, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `database/schema.sql`
4. Paste into the editor
5. Click "Run"
6. Check for success message

---

## Step 3: Set Up Backend

### 3.1 Navigate to Backend
```bash
cd backend
```

### 3.2 Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3.3 Install Dependencies
```bash
pip install -r requirements.txt
```

### 3.4 Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
# Open in your editor and update:
```

Edit `.env` with these values:

```env
# Supabase (from step 2.2)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT (generate a random string)
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Provider (use groq or huggingface)
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key-here

# Server Configuration
DEBUG=True
ENVIRONMENT=development
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=INFO
```

### 3.5 Get Groq API Key (or use alternative)
1. Go to https://console.groq.com/keys
2. Create new API key
3. Copy and paste into `.env` as `GROQ_API_KEY`

**Alternative AI Providers**:
- HuggingFace: Get free key at https://huggingface.co/settings/tokens
- Ollama: Run locally with `ollama run mixtral`

### 3.6 Run Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
Uvicorn running on http://0.0.0.0:8000
```

### 3.7 Test Backend
Open in browser or terminal:
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

---

## Step 4: Set Up Frontend

### 4.1 Navigate to Frontend (new terminal)
```bash
cd frontend
```

### 4.2 Install Dependencies
```bash
npm install
```

### 4.3 Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit if needed (optional for local development)
# The default should work: VITE_API_URL=http://localhost:8000
```

### 4.4 Run Frontend Development Server
```bash
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 4.5 Open in Browser
Navigate to http://localhost:5173

---

## Step 5: Test the Application

### 5.1 Register a New User
1. Click "Get Started" on landing page
2. Fill in:
   - **Full Name**: John Doe
   - **Email**: test@example.com
   - **Password**: Password123!
   - **Confirm**: Password123!
3. Click "Create Account"

### 5.2 Create a Trip
1. Click "New Trip" on dashboard
2. Fill in the form:
   - **Destination**: Paris
   - **Start Date**: Pick a future date
   - **End Date**: Pick later date
   - **Daily Budget**: 150
3. Click "Next"
4. Select:
   - **Travel Style**: Cultural
   - **Interests**: History, Art, Food
   - **Pace**: Moderate
5. Click "Next"
6. Set:
   - **Group Size**: 2
7. Click "Create Trip"

### 5.3 Generate Itinerary
1. Click "Generate Itinerary"
2. Wait for AI to generate (30-60 seconds)
3. View the itinerary with day-by-day breakdown

### 5.4 Test Features
- [ ] Expand/collapse days
- [ ] See cost breakdown
- [ ] Export itinerary
- [ ] Create another trip
- [ ] Delete a trip
- [ ] Logout and login again

---

## Troubleshooting

### Backend Won't Start

**Error**: `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution: Install requirements
pip install -r requirements.txt
```

**Error**: `Connection refused` to Supabase
```bash
# Check:
# 1. SUPABASE_URL is correct (https://...)
# 2. SUPABASE_KEY is correct
# 3. Schema is initialized in Supabase
# 4. Network connection is working
```

**Error**: `Invalid API Key` for Groq
```bash
# Solution:
# 1. Go to https://console.groq.com
# 2. Create new API key
# 3. Update GROQ_API_KEY in .env
# 4. Restart backend
```

### Frontend Won't Start

**Error**: `npm install` fails
```bash
# Solution:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Error**: Port 5173 already in use
```bash
# Solution: Use different port
npm run dev -- --port 3000
```

**Error**: "Cannot find module 'react'"
```bash
# Solution: Install dependencies
npm install
```

### API Connection Issues

**Error**: `GET http://localhost:8000/health 404`
- Backend not running? Start it: `python -m uvicorn app.main:app --reload`

**Error**: CORS errors in browser console
- Check `FRONTEND_URL` in backend `.env`
- Should match your frontend URL

**Error**: "Failed to authenticate"
- Check `SUPABASE_KEY` in `.env`
- Verify user exists in Supabase dashboard

---

## Development Workflow

### Useful Commands

**Backend**:
```bash
# Start server
python -m uvicorn app.main:app --reload

# Run linting
flake8 app/

# Run tests (add pytest)
pytest

# View logs
# Check terminal output
```

**Frontend**:
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Hot Reload
- **Backend**: Changes auto-reload (with `--reload`)
- **Frontend**: Changes auto-reload (Vite HMR)

### Database Changes
If you modify the schema:
1. Update `database/schema.sql`
2. Run the new SQL in Supabase SQL Editor
3. Restart backend and frontend

---

## Project Structure Quick Reference

```
travel-planner/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── main.py            # Entry point
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   ├── schemas/           # Pydantic models
│   │   └── db/                # Database setup
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment template
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API client
│   │   └── store/             # State management
│   ├── package.json           # Node dependencies
│   └── .env.example           # Environment template
├── database/
│   └── schema.sql             # Database schema
└── README.md                  # Main documentation
```

---

## Next Steps

1. **Explore the Code**
   - Check `backend/app/main.py` for API structure
   - Check `frontend/src/pages/Landing.jsx` for UI components

2. **Customize**
   - Update branding in `Landing.jsx`
   - Modify prompt templates in `backend/app/prompts/templates.py`
   - Change colors in `frontend/tailwind.config.js`

3. **Add Features**
   - See [API.md](API.md) for endpoint details
   - Follow existing patterns for new features

4. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
   - Render for backend, Vercel for frontend

---

## Support

**Getting Help**:
1. Check project README.md
2. Review API.md for endpoint details
3. Check browser console for frontend errors
4. Check backend terminal for server errors
5. Open issues on GitHub

**Common Questions**:

Q: How do I change the AI model?
A: Edit `AI_PROVIDER` in `.env` and update the model in `backend/app/services/ai.py`

Q: How do I add new preferences?
A: Add to database schema, update Pydantic models, and update form components

Q: How do I implement dark mode?
A: Check `frontend/tailwind.config.js` and add dark variant components

Q: How long does itinerary generation take?
A: Usually 30-60 seconds with Groq. Depends on destination length.

---

## Security Reminders

- ⚠️ Never commit `.env` file
- ⚠️ Never share API keys
- ⚠️ Change `SECRET_KEY` in production
- ⚠️ Use HTTPS in production
- ⚠️ Enable database RLS in Supabase

---

**You're all set!** 🎉 Start building your travel itinerary planner.
