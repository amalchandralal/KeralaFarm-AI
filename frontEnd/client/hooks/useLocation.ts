import { useState, useEffect } from 'react'

export interface UserLocation {
  lat: number
  lon: number
  label: string      // human-readable e.g. "Thrissur, Kerala"
  source: 'gps' | 'fallback'
}

// Kerala centre as fallback
const KERALA_FALLBACK: UserLocation = {
  lat: 10.8505,
  lon: 76.2711,
  label: 'Kerala (default)',
  source: 'fallback',
}

const CACHE_KEY = 'user_location'
const CACHE_TTL = 10 * 60 * 1000  // 10 minutes

// Try to reverse-geocode lat/lon → district name using OpenStreetMap (free)
const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await res.json()
    const parts = [
      data.address?.county || data.address?.city || data.address?.town || data.address?.village,
      data.address?.state,
    ].filter(Boolean)
    return parts.join(', ') || `${lat.toFixed(2)}, ${lon.toFixed(2)}`
  } catch {
    return `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`
  }
}

export const useLocation = () => {
  const [location, setLocation]   = useState<UserLocation | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [permissionDenied, setPermissionDenied] = useState(false)

  const getLocation = () => {
    setLoading(true)
    setError('')

    // Return cached location if fresh
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data, ts } = JSON.parse(cached)
        if (Date.now() - ts < CACHE_TTL) {
          setLocation(data)
          setLoading(false)
          return
        }
      }
    } catch { /* ignore */ }

    if (!navigator.geolocation) {
      setLocation(KERALA_FALLBACK)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords
        const label = await reverseGeocode(lat, lon)
        const loc: UserLocation = { lat, lon, label, source: 'gps' }
        setLocation(loc)
        setLoading(false)
        // Cache it
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: loc, ts: Date.now() }))
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true)
          setError('Location permission denied. Showing Kerala weather.')
        } else {
          setError('Could not get location. Showing Kerala weather.')
        }
        setLocation(KERALA_FALLBACK)
        setLoading(false)
      },
      { timeout: 8000, maximumAge: CACHE_TTL, enableHighAccuracy: false }
    )
  }

  useEffect(() => { getLocation() }, [])

  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    getLocation()
  }

  return { location, loading, error, permissionDenied, refresh: clearCache }
}
