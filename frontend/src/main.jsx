import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { CreateTrip } from './pages/CreateTrip'
import { TripView } from './pages/TripView'
import { Explore } from './pages/Explore'
import { SavedPlaces } from './pages/SavedPlaces'
import { TripHistory } from './pages/TripHistory'
import './index.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/trip/:tripId" element={<ProtectedRoute><TripView /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/saved-places" element={<ProtectedRoute><SavedPlaces /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><TripHistory /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
