import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../hooks/useLocation'
import { getDashboard, getAQI, getHourlyForecast } from '../services/api'
import { 
  Droplet, CloudRain, Wind, Cloud, AlertTriangle, RefreshCw, 
  MapPin, Siren, CheckCircle2, Zap, Mic, Camera, BarChart3, 
  Download, Sun, ChevronRight,
  Bug, Leaf, Droplets, ThermometerSun, Sprout, Package, Thermometer,
  CloudDrizzle, CloudLightning, Snowflake, CloudFog
} from 'lucide-react'

// ─── Dynamic Icon Mapper ──────────────────────────────────────────────────────
const IconMap = {
  'bug': Bug, 'leaf': Leaf, 'droplets': Droplets, 'thermometer-sun': ThermometerSun,
  'wind': Wind, 'sprout': Sprout, 'package': Package, 'sun': Sun, 'thermometer': Thermometer,
  'cloud': Cloud, 'cloud-rain': CloudRain, 'cloud-drizzle': CloudDrizzle,
  'cloud-lightning': CloudLightning, 'snowflake': Snowflake, 'cloud-fog': CloudFog
}

const DynamicIcon = ({ name, className, size = 20 }) => {
  const Icon = IconMap[name] || CheckCircle2
  return <Icon className={className} size={size} />
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityBorder = { high: 'border-l-rose-500', medium: 'border-l-amber-500', low: 'border-l-emerald-500' }
const severityIconColor = { high: 'text-rose-500 bg-rose-50', medium: 'text-amber-500 bg-amber-50', low: 'text-emerald-500 bg-emerald-50' }

const aqiColor = (aqi) => {
  if (aqi <= 50)  return 'text-emerald-600 bg-emerald-50 border-emerald-100'
  if (aqi <= 100) return 'text-amber-600 bg-amber-50 border-amber-100'
  if (aqi <= 150) return 'text-orange-600 bg-orange-50 border-orange-100'
  return 'text-rose-600 bg-rose-50 border-rose-100'
}

// ─── Location Permission Banner ───────────────────────────────────────────────
const LocationBanner = ({ denied, error, onRetry }) => {
  if (!error) return null
  return (
    <div className={`rounded-2xl p-4 mb-6 flex items-start sm:items-center gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
      denied ? 'bg-amber-50 border border-amber-200/60' : 'bg-blue-50 border border-blue-200/60'
    }`}>
      <MapPin size={20} className={`mt-0.5 sm:mt-0 flex-shrink-0 ${denied ? 'text-amber-500' : 'text-blue-500'}`} />
      <div className="flex-1">
        <p className={`font-medium ${denied ? 'text-amber-800' : 'text-blue-800'}`}>{error}</p>
        {denied && (
          <p className="text-xs text-amber-600/80 mt-1">
            Click the lock icon in your address bar to allow location access.
          </p>
        )}
      </div>
      <button onClick={onRetry} className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-white rounded-lg shadow-sm hover:shadow transition-shadow text-slate-700">
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
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="max-w-6xl mx-auto">

        <LocationBanner denied={permissionDenied} error={locErr} onRetry={retryLocation} />

        {/* Header / Greeting */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">
              {greeting}, {user?.name?.split(' ')[0] || 'Farmer'}
            </h1>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200/60 rounded-full text-sm text-slate-500 shadow-sm">
              <MapPin size={14} className="text-emerald-500" />
              {isLoading ? (
                <span className="animate-pulse">Detecting your location…</span>
              ) : (
                <span className="font-medium text-slate-700">
                  {location?.source === 'gps' ? location.label : weather?.name || location?.label || 'Unknown location'}
                </span>
              )}
              <button onClick={retryLocation} className="ml-1 p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="flex items-center gap-3 p-4 mb-8 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200/60 rounded-2xl">
            <AlertTriangle size={18} /> {apiError}
          </div>
        )}

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ─── LEFT COLUMN (Weather, Hourly, Actions) ─── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Hero Weather Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-900/10 text-white">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-emerald-400 opacity-20 rounded-full blur-2xl mix-blend-overlay"></div>
              
              {isLoading ? (
                 <div className="animate-pulse h-32 w-full bg-white/10 rounded-2xl"></div>
              ) : (
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                      <p className="text-emerald-100/80 font-medium mb-1">Current Weather</p>
                      <div className="flex items-start">
                        <span className="text-6xl sm:text-7xl font-bold tracking-tighter stat-value">{temp}</span>
                        <span className="text-2xl sm:text-3xl font-medium text-emerald-200 mt-2 ml-1">°C</span>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:items-end gap-3 text-right">
                      {weather?.weather?.[0]?.icon && (
                         <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={condition} className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg" />
                      )}
                      <p className="text-xl font-medium capitalize text-white drop-shadow-sm">{condition}</p>
                    </div>
                  </div>
                  
                  {/* Weather Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Droplet,  label: 'Humidity', value: `${humidity}%` },
                      { icon: CloudRain, label: 'Rainfall', value: `${rainfall} mm` },
                      { icon: Wind,     label: 'Wind',      value: `${windSpeed} km/h` },
                      { icon: Cloud,    label: 'Cloud Cover', value: `${weather?.clouds?.all ?? '0'}%` },
                    ].map((s, i) => {
                      const Icon = s.icon
                      return (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-center border border-white/10">
                          <div className="flex items-center gap-2 mb-2 text-emerald-100">
                            <Icon size={16} />
                            <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
                          </div>
                          <p className="text-lg font-semibold stat-value">{s.value}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions (Moved below weather for immediate access) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { to: '/voice',   icon: Mic,       label: 'Ask AI',       color: 'bg-blue-50 text-blue-600 border-blue-100', hover: 'hover:border-blue-300 hover:shadow-blue-900/5' },
                { to: '/scan',    icon: Camera,    label: 'Scan Crop',    color: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-emerald-900/5' },
                { to: '/tracker', icon: BarChart3, label: 'Tracker',      color: 'bg-indigo-50 text-indigo-600 border-indigo-100', hover: 'hover:border-indigo-300 hover:shadow-indigo-900/5' },
                { to: '/offline', icon: Download,  label: 'Offline Data', color: 'bg-slate-100 text-slate-600 border-slate-200', hover: 'hover:border-slate-300 hover:shadow-slate-900/5' },
              ].map(a => {
                const Icon = a.icon
                return (
                  <Link key={a.to} to={a.to}
                    className={`group relative overflow-hidden bg-white border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${a.hover}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${a.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{a.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Hourly Forecast */}
            {hourly.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Today's Forecast</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide -mx-2 px-2">
                  {hourly.slice(0, 12).map((h, i) => (
                    <div key={i} className="snap-start flex-shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 min-w-[90px] flex flex-col items-center justify-between transition-colors hover:bg-emerald-50 hover:border-emerald-100 cursor-default">
                      <p className="text-sm font-semibold text-slate-500 mb-3">{h.time}</p>
                      <div className="mb-3 text-slate-700">
                        <DynamicIcon name={h.icon} size={28} />
                      </div>
                      <p className="text-lg font-bold text-slate-900 stat-value">{Math.round(h.temp)}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* ─── RIGHT COLUMN (Stats, Alerts, Recs) ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Secondary Stats (AQI & UV) */}
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                <>
                  <div className="animate-pulse h-28 bg-white border border-slate-200/60 rounded-3xl"></div>
                  <div className="animate-pulse h-28 bg-white border border-slate-200/60 rounded-3xl"></div>
                </>
              ) : (
                <>
                  {aqi && (
                    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${aqiColor(aqi.aqi)}`}>
                          <Wind size={18} />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AQI</span>
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                          <span className="text-3xl font-bold text-slate-900 stat-value">{aqi.aqi}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">{aqi.label}</p>
                      </div>
                    </div>
                  )}
                  {/* UV Index Placeholder (can be wired to real data later) */}
                  <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-5 flex flex-col justify-between group hover:shadow-md hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-orange-50 border-orange-100 text-orange-500">
                        <Sun size={18} />
                      </div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">UV</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5 mb-0.5">
                        <span className="text-3xl font-bold text-slate-900 stat-value">4.2</span>
                      </div>
                      <p className="text-sm font-medium text-slate-500">Moderate</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Crop Alerts */}
            {alerts.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Siren size={20} className="text-rose-500" /> 
                    Alerts
                  </h2>
                </div>
                
                {/* Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide -mx-2 px-2">
                  {['all', 'paddy', 'coconut', 'banana', 'vegetable'].map(c => (
                    <button key={c} onClick={() => setCrop(c)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide capitalize whitespace-nowrap transition-all ${
                        crop === c 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {alerts
                    .filter(a => crop === 'all' || !a.title || a.title.toLowerCase().includes(crop))
                    .map((a, i) => (
                      <div key={i} className={`relative bg-slate-50 border-l-4 rounded-2xl p-4 hover:bg-slate-100 transition-colors ${severityBorder[a.severity]}`}>
                        <div className="flex gap-3">
                          <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${severityIconColor[a.severity]}`}>
                            {a.icon ? <DynamicIcon name={a.icon} size={14} /> : <AlertTriangle size={14} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 mb-1">{a.title}</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{a.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {recs.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    AI Actions
                  </h2>
                </div>
                <div className="space-y-4">
                  {recs.map((r, i) => (
                    <div key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-4 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                      <div className="mt-1 text-emerald-600">
                        <DynamicIcon name={r.icon} size={24} />
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-1 bg-white border border-slate-200/60 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md mb-2 shadow-sm">
                          {r.tag}
                        </span>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}