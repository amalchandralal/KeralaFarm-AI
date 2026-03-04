import api from '../lib/axios'

// Auth Services
export const registerUser = async (data: { name: string; email: string; password: string }) => {
  const res = await api.post('/register', data)
  return res.data
}

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post('/login', data)
  return res.data
}

export const getProfile = async () => {
  const res = await api.get('/profile')
  return res.data
}

export const logoutUser = async () => {
  const res = await api.post('/logout')
  return res.data
}

// AI Services
export const detectDisease = async (imageFile: File) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  const res = await api.post('/detect-disease', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const askVoiceAssistant = async (question: string) => {
  const res = await api.post('/voice-assistant', { question })
  return res.data
}

// Places Services
export const getPlaces = async () => {
  const res = await api.get('/places')
  return res.data
}

// Booking Services
export const createBooking = async (data: Record<string, unknown>) => {
  const res = await api.post('/bookings', data)
  return res.data
}

export const getBookings = async () => {
  const res = await api.get('/bookings')
  return res.data
}

// ── NEW: Weather Enhancement Services ──────────────────────────────────────

/** Air Quality Index data from /dashboard/aqi */
export const getAQI = async () => {
  const res = await api.get('/dashboard/aqi')
  return res.data
}

/** UV Index + hourly irrigation schedule from /dashboard/hourly */
export const getHourlyForecast = async () => {
  const res = await api.get('/dashboard/hourly')
  return res.data
}