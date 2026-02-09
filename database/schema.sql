-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============ USERS TABLE ============
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============ TRIPS TABLE ============
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  preferences JSONB NOT NULL, -- { "travel_style": "adventure", "interests": ["food"], "budget_per_day_inr": 5000, "pace": "moderate" }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_created_at ON trips(created_at DESC);

-- ============ ITINERARIES TABLE ============
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  destination VARCHAR(255) NOT NULL,
  duration_days INTEGER NOT NULL,
  total_estimated_cost DECIMAL(10, 2) NOT NULL,
  itinerary_days JSONB NOT NULL, -- Array of { "day": 1, "morning": "...", "estimated_cost_inr": 1200, ... }
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_itineraries_trip_id ON itineraries(trip_id);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);

-- ============ SAVED_PLACES TABLE ============
CREATE TABLE saved_places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location_type VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  estimated_cost DECIMAL(10, 2),
  website VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_saved_places_trip_id ON saved_places(trip_id);
CREATE INDEX idx_saved_places_user_id ON saved_places(user_id);

-- ============ HISTORY TABLE ============
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_user_id ON history(user_id);
CREATE INDEX idx_history_created_at ON history(created_at DESC);

-- ============ FEEDBACK TABLE ============
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_itinerary_id ON feedback(itinerary_id);

-- ============ PREFERENCES TABLE ============
CREATE TABLE preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  currency VARCHAR(3) DEFAULT 'INR',
  settings JSONB, -- { "notification_types": ["email"], "discovery_radius": 50 }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_preferences_user_id ON preferences(user_id);

-- ============ ENABLE ROW LEVEL SECURITY ============
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

-- ============ ROW LEVEL SECURITY POLICIES ============

-- Users: Can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Trips: Can only see own trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Itineraries: Can only see own itineraries
CREATE POLICY "Users can view own itineraries" ON itineraries
  FOR SELECT USING (
    trip_id IN (
      SELECT id FROM trips WHERE user_id = auth.uid()::uuid
    )
  );

-- Saved Places: Can only see own saved places
CREATE POLICY "Users can view own saved places" ON saved_places
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- History: Can only see own history
CREATE POLICY "Users can view own history" ON history
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Feedback: Can only see own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Preferences: Can only see own preferences
CREATE POLICY "Users can view own preferences" ON preferences
  FOR SELECT USING (auth.uid()::text = user_id::text);
