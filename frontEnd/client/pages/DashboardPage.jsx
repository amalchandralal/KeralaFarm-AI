import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../hooks/useLocation'
import { getDashboard, getAQI, getHourlyForecast } from '../services/api'
import { Droplet, CloudRain, Wind, Cloud, AlertTriangle, RefreshCw, MapPin, Siren, CheckCircle2, Zap, Mic, Camera, BarChart3, Download, Sun } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityBorder = { high: 'border-l-red-500', medium: 'border-l-yellow-500', low: 'border-l-emerald-500' }
const severityIconColor = { high: 'text-red-500 bg-red-50', medium: 'text-yellow-500 bg-yellow-50', low: 'text-emerald-500 bg-emerald-50' }

const aqiColor = (aqi) => {
  if (aqi <= 50)  return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (aqi <= 100) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  if (aqi <= 150) return 'text-orange-600 bg-orange-50 border-orange-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

const windDir = (deg) => {
  const dirs = ['N','NE','E','SE','S','SW','W','NW']
  return dirs[Math.round(deg / 45) % 8]
}

// ─── Location Permission Banner ───────────────────────────────────────────────
const LocationBanner = ({ denied, error, onRetry }) => {
  if (!error) return null
  return (
    <div className={`rounded-xl p-3 mb-4 flex items-center gap-3 text-sm ${
      denied ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
    }`}>
      <MapPin size={20} className={denied ? 'text-yellow-500' : 'text-blue-500'} />
      <div className="flex-1">
        <p className={denied ? 'text-yellow-700' : 'text-blue-700'}>{error}</p>
        {denied && (
          <p className="text-xs text-yellow-500 mt-0.5">
            To enable: click the lock icon in address bar → Allow Location
          </p>
        )}
      </div>
      <button onClick={onRetry} className="flex-shrink-0 text-xs font-medium text-emerald-600 hover:underline">
        Retry
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }                                          = useAuth()
  const { location, loading: locLoading, error: locErr,
          permissionDenied, refresh: retryLocation }      = useLocation()

  const [weather,   setWeather]   = useState(null)
  const [alerts,    setAlerts]    = useState([])
  const [recs,      setRecs]      = useState([])
  const [hourly,    setHourly]    = useState([])
  const [aqi,       setAqi]       = useState(null)
  const [loading,   setLoading]   = useState(false)
  const [apiError,  setApiError]  = useState('')
  const [crop,      setCrop]      = useState('all')

  useEffect(() => {
    if (!location) return
    fetchAll(location.lat, location.lon)
  }, [location])

  const fetchAll = async (lat, lon) => {
    setLoading(true)
    setApiError('')
    try {
      const [dash, aqiData, forecastData] = await Promise.allSettled([
        getDashboard(lat, lon),
        getAQI(lat, lon),
        getHourlyForecast(lat, lon),
      ])

      if (dash.status === 'fulfilled') {
        setWeather(dash.value.weather)
        setAlerts(dash.value.alerts  || [])
        setRecs(dash.value.recommendations || [])
      } else {
        setApiError('Weather data unavailable. Check your backend connection.')
      }

      if (aqiData.status === 'fulfilled')    setAqi(aqiData.value)
      if (forecastData.status === 'fulfilled') setHourly(forecastData.value?.hourly || forecastData.value || [])

    } catch {
      setApiError('Failed to load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const time      = new Date()
  const greeting  = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 17 ? 'Good Afternoon' : 'Good Evening'
  const temp      = weather ? Math.round(weather?.main?.temp) : '—'
  const humidity  = weather ? weather?.main?.humidity : '—'
  const condition = weather ? weather?.weather?.[0]?.description : 'Loading...'
  const windSpeed = weather ? Math.round(weather?.wind?.speed * 3.6) : '—'
  const rainfall  = weather ? (weather?.rain?.['1h'] ?? weather?.rain?.['3h'] ?? 0) : 0

  const isLoading = locLoading || loading

  if (!isLoading && !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        <LocationBanner denied={permissionDenied} error={locErr} onRetry={retryLocation} />

        {/* 1. Greeting Bar */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {greeting}, {user?.name || 'Farmer'}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-500">
            <MapPin size={14} className="text-gray-400" />
            {isLoading ? (
              <span className="animate-pulse">Detecting location…</span>
            ) : (
              <span>
                {location?.source === 'gps' ? location.label : weather?.name || location?.label || 'Unknown location'}
              </span>
            )}
            <button onClick={retryLocation} className="ml-1 text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {apiError && (
          <div className="flex items-center gap-3 p-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle size={18} /> {apiError}
          </div>
        )}

        {/* 2. Weather Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6">
          {isLoading ? (
             <div className="skeleton h-32 w-full rounded-lg"></div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="flex items-start">
                    <span className="text-4xl font-mono font-bold text-gray-900 tracking-tight stat-value">{temp}</span>
                    <span className="text-xl font-medium text-gray-400 mt-1 ml-1">°C</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  {weather?.weather?.[0]?.icon && (
                     <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={condition} className="w-12 h-12 -mt-2 -mr-2 opacity-80" />
                  )}
                  <p className="text-gray-900 font-medium capitalize">{condition}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Droplet,  label: 'Humidity', value: `${humidity}%` },
                  { icon: CloudRain, label: 'Rain',     value: `${rainfall}mm` },
                  { icon: Wind,     label: 'Wind',      value: `${windSpeed}km/h` },
                  { icon: Cloud,    label: 'Clouds',    value: `${weather?.clouds?.all ?? '—'}%` },
                ].map(s => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="bg-gray-50 rounded-lg p-3 flex flex-col items-center justify-center border border-gray-100">
                      <Icon size={16} className="text-gray-400 mb-1.5" />
                      <p className="text-sm font-mono font-semibold text-gray-900 stat-value">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* 3. Stat Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <div className="skeleton h-24 rounded-lg"></div>
              <div className="skeleton h-24 rounded-lg"></div>
            </>
          ) : (
            <>
              {aqi && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${aqiColor(aqi.aqi)}`}>
                    <Wind size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Air Quality</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-mono font-bold text-gray-900 stat-value">{aqi.aqi}</span>
                      <span className="text-xs font-medium text-gray-500">{aqi.label}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Optional secondary stat card, e.g. UV Index */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50 border border-gray-200 text-gray-500">
                    <Sun size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">UV Index</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-mono font-bold text-gray-900 stat-value">4.2</span>
                      <span className="text-xs font-medium text-gray-500">Moderate</span>
                    </div>
                  </div>
              </div>
            </>
          )}
        </div>

        {/* 4. Hourly Forecast */}
        {hourly.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Hourly Forecast</h2>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
              {hourly.slice(0, 12).map((h, i) => (
                <div key={i} className="snap-start flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 min-w-[80px] flex flex-col items-center justify-between shadow-xs hover:shadow-sm transition-shadow">
                  <p className="text-xs font-medium text-gray-500 mb-2">{h.time}</p>
                  <p className="text-2xl mb-2">{h.icon}</p>
                  <p className="text-base font-mono font-semibold text-gray-900 stat-value">{Math.round(h.temp)}°</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Crop Alerts Section */}
        {alerts.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Siren size={18} className="text-emerald-600" /> 
                Crop Alerts
              </h2>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {['all', 'paddy', 'coconut', 'banana', 'vegetable'].map(c => (
                  <button key={c} onClick={() => setCrop(c)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-colors ${
                      crop === c 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {alerts
                .filter(a => crop === 'all' || !a.title || a.title.toLowerCase().includes(crop))
                .map((a, i) => (
                  <div key={i} className={`bg-white border border-gray-200 border-l-4 rounded-lg p-4 shadow-xs hover:shadow-sm transition-shadow ${severityBorder[a.severity]}`}>
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${severityIconColor[a.severity]}`}>
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{a.title}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 6. Recommendations Section */}
        {recs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Recommendations
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {recs.map((r, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-start gap-3 hover:shadow-sm transition-shadow">
                  <div className="text-2xl mt-0.5">{r.icon}</div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-1.5">
                      {r.tag}
                    </span>
                    <p className="text-sm text-gray-900 leading-relaxed">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/voice',   icon: Mic,       label: 'Ask AI' },
              { to: '/scan',    icon: Camera,    label: 'Scan Crop' },
              { to: '/tracker', icon: BarChart3, label: 'Tracker' },
              { to: '/offline', icon: Download,  label: 'Offline' },
            ].map(a => {
              const Icon = a.icon
              return (
                <Link key={a.to} to={a.to}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 shadow-xs hover:bg-gray-50 hover:shadow-sm transition-all">
                  <Icon size={20} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}