# Frontend - Travel Itinerary Planner

React + Vite frontend for the AI-powered travel itinerary planner.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Visit http://localhost:5173

## Structure

- `src/pages/` - Page components (Landing, Login, Register, Dashboard, etc.)
- `src/components/` - Reusable components
- `src/services/api.js` - API client with Axios
- `src/store/store.js` - Zustand state management
- `src/hooks/` - Custom React hooks
- `src/index.css` - Global styles

## Configuration

Set `VITE_API_URL` in `.env`:
```
VITE_API_URL=http://localhost:8000
```

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Pages

- **Landing** - Home page with features overview
- **Register** - User registration
- **Login** - User authentication
- **Dashboard** - Trip list and management
- **CreateTrip** - Multi-step trip creation form
- **TripView** - Display and manage trip itinerary

## Components

Key component structure:
- Forms with validation
- Cards with animations
- Loading states and error handling
- Responsive mobile-first design

## Styling

- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Icon components
- Custom `tailwind.config.js` for theme

## API Integration

```javascript
import { tripsAPI, authAPI } from './services/api'

// Login
const response = await authAPI.login({ email, password })

// Create trip
const trip = await tripsAPI.createTrip(tripData)

// Generate itinerary
const itinerary = await tripsAPI.generateItinerary(tripId)
```

## State Management

Using Zustand for global state:
- `useAuthStore` - Authentication state
- `useTripStore` - Trip and itinerary state

## Features

- ✅ Responsive design
- ✅ Dark/light mode ready
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Smooth animations
- ✅ Protected routes

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build
```

## Production

See [DEPLOYMENT.md](../DEPLOYMENT.md) for Vercel deployment.

Key checklist:
- [ ] Set `VITE_API_URL` to production API
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Configure custom domain
- [ ] Set up analytics

## Technologies

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons
