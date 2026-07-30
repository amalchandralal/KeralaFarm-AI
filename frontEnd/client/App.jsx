import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import VoicePage from './pages/VoicePage'
import ScanPage from './pages/ScanPage'
import ResourceTrackerPage from './pages/ResourceTrackerPage'
import OfflinePage from './pages/OfflinePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import PlacesPage from './pages/PlacesPage'
import BookingsPage from './pages/BookingsPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"             element={<HomePage />} />
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/voice"        element={<VoicePage />} />
              <Route path="/scan"         element={<ScanPage />} />
              <Route path="/tracker"      element={<ResourceTrackerPage />} />
              <Route path="/offline"      element={<OfflinePage />} />
              <Route path="/login"        element={<LoginPage />} />
              <Route path="/register"     element={<RegisterPage />} />
              <Route path="/profile"      element={<ProfilePage />} />
              <Route path="/places"       element={<PlacesPage />} />
              <Route path="/bookings"     element={<BookingsPage />} />
              <Route path="/bookings/new" element={<BookingsPage />} />
              <Route path="*"             element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
