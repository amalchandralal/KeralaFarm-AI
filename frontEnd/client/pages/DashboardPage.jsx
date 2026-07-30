import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLocation } from '../hooks/useLocation'
import { getDashboard, getAQI, getHourlyForecast } from '../services/api'
import { Droplet, CloudRain, Wind, Cloud, AlertTriangle, RefreshCw, MapPin, Siren, CheckCircle2, Zap, Mic, Camera, BarChart3, Download } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityBorder = { high: 'border-red-400 bg-red-50', medium: 'border-yellow-400 bg-yellow-50', low: 'border-green-400 bg-green-50' }
const severityBadge  = { high: 'bg-red-100 text-red-700',  medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' }

const aqiColor = (aqi) => {
  if (aqi <= 50)  return 'text-green-600 bg-green-50'
  if (aqi <= 100) return 'text-yellow-600 bg-yellow-50'
  if (aqi <= 150) return 'text-orange-600 bg-orange-50'
  return 'text-red-600 bg-red-50'
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
  const [crop,      setCrop]      = useState('paddy')

  // Fetch all dashboard data once location is ready
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
  const temp      = weather ? Math.round(weather.main.temp) : '—'
  const humidity  = weather ? weather.main.humidity : '—'
  const condition = weather ? weather.weather[0].description : 'Loading...'
  const windSpeed = weather ? Math.round(weather.wind.speed * 3.6) : '—'
  const rainfall  = weather ? (weather.rain?.['1h'] ?? weather.rain?.['3h'] ?? 0) : 0

  const isLoading = locLoading || loading

  return (
    <div className="pt-24 pb-20 space-y-5 page-container">

      {/* Location permission error */}
      <LocationBanner denied={permissionDenied} error={locErr} onRetry={retryLocation} />

      {/* ── Hero Weather Card ── */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute w-64 h-64 rounded-full -top-24 -right-24 bg-white/10 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="mb-1 text-sm font-bold tracking-widest uppercase text-emerald-100">{greeting}</p>
              <h1 className="text-3xl font-black">{String(user?.name || 'Farmer')}</h1>
              {/* Location label */}
              <div className="flex items-center gap-2 px-4 py-2 mt-3 rounded-full bg-white/10 backdrop-blur-md w-fit">
                <MapPin size={16} />
                {isLoading ? (
                  <span className="text-sm font-bold text-emerald-100 animate-pulse">Detecting location…</span>
                ) : (
                  <div className="flex items-center">
                    <span className="text-sm font-black text-white">
                      {location?.source === 'gps' ? location.label : weather?.name || location?.label}
                    </span>
                    {location?.source === 'fallback' && (
                      <span className="text-emerald-200 text-[10px] ml-2 font-black uppercase">(default)</span>
                    )}
                  </div>
                )}
                <button onClick={retryLocation} title="Refresh location"
                  className="ml-2 transition-colors text-emerald-200 hover:text-white">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Current temp */}
            <div className="text-right">
              {isLoading ? (
                <div className="w-12 h-12 ml-auto border-4 rounded-full border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <p className="text-6xl font-black leading-none tracking-tighter">{temp}°</p>
                  <p className="mt-2 text-sm font-black tracking-wide capitalize text-emerald-100">{condition}</p>
                  <p className="text-emerald-200 text-[10px] font-black uppercase mt-1">Feels {weather ? Math.round(weather.main.feels_like) : '—'}°</p>
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Droplet,  label: 'Humidity', value: `${humidity}%` },
              { icon: CloudRain, label: 'Rain',     value: `${rainfall}mm` },
              { icon: Wind,     label: 'Wind',      value: `${windSpeed}km/h ${weather ? windDir(weather.wind.deg) : ''}` },
              { icon: Cloud,    label: 'Clouds',    value: `${weather ? weather.clouds.all : '—'}%` },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="p-4 text-center border bg-white/10 backdrop-blur-md rounded-2xl border-white/10">
                  <Icon size={24} className="mx-auto mb-1" />
                  <p className="text-sm font-black text-white">{isLoading ? '…' : s.value}</p>
                  <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* API error */}
      {apiError && (
        <div className="flex items-center gap-3 p-4 text-sm font-bold text-red-700 border border-red-100 bg-red-50 rounded-2xl">
          <AlertTriangle size={20} /> {apiError}
        </div>
      )}

      {/* ── AQI ── */}
      {aqi && (
        <div className={`rounded-3xl flex items-center gap-6 p-6 border transition-all ${aqiColor(aqi.aqi)}`}>
          <div className="flex flex-col items-center justify-center w-20 h-20 text-center shadow-sm bg-white/50 backdrop-blur-sm rounded-2xl">
            <p className="text-3xl font-black leading-none">{aqi.aqi}</p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-1">AQI</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-black">{aqi.label}</p>
            <p className="text-xs font-medium opacity-70">Air quality in your current farming zone</p>
          </div>
          <Wind size={36} />
        </div>
      )}

      {/* ── Hourly Forecast ── */}
      {hourly.length > 0 && (
        <div className="pt-4">
          <h2 className="px-2 mb-4 text-lg font-black text-slate-900">Hourly Forecast</h2>
          <div className="flex gap-4 px-2 pb-6 overflow-x-auto scrollbar-hide">
            {hourly.slice(0, 12).map((h, i) => (
              <div key={i} className="flex-shrink-0 bg-white border border-slate-100 rounded-2xl text-center px-5 py-6 min-w-[100px] shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{h.time}</p>
                <p className="my-3 text-3xl">{h.icon}</p>
                <p className="text-lg font-black text-slate-900">{Math.round(h.temp)}°</p>
                {h.rain > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <span className="text-[10px] text-blue-500 font-black tracking-tighter">{h.rain}mm</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Crop Alerts ── */}
      {alerts.length > 0 && (
        <div className="pt-4">
          <div className="flex flex-col justify-between gap-4 px-2 mb-6 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-900"><Siren size={18} /> Smart Crop Alerts</h2>
            {/* Crop filter */}
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
              {['paddy','coconut','banana','vegetable'].map(c => (
                <button key={c} onClick={() => setCrop(c)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    crop === c ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="px-2 space-y-3">
            {alerts
              .filter(a => !a.title || a.title.toLowerCase().includes(crop) || true)
              .map((a, i) => (
                <div key={i} className={`border rounded-3xl p-6 transition-all hover:shadow-md ${severityBorder[a.severity]}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${severityBadge[a.severity]}`}>
                        {a.icon}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">{a.title}</p>
                        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">{a.desc}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${severityBadge[a.severity]}`}>
                      {a.severity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Recommendations ── */}
      {recs.length > 0 && (
        <div className="pt-4">
          <h2 className="flex items-center gap-2 px-2 mb-4 text-lg font-black text-slate-900"><CheckCircle2 size={18} /> Expert Recommendations</h2>
          <div className="px-2 space-y-3">
            {recs.map((r, i) => (
              <div key={i} className="flex items-start gap-5 p-6 transition-all bg-white border border-slate-100 rounded-3xl hover:shadow-md">
                <div className="flex items-center justify-center text-3xl w-14 h-14 bg-emerald-50 rounded-2xl shrink-0">
                  {r.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                      {r.tag}
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-slate-700">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="px-2 space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-slate-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="pt-8">
        <h2 className="flex items-center gap-2 px-2 mb-6 text-lg font-black text-slate-900"><Zap size={18} /> Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 px-2">
          {[
            { to: '/voice',   icon: Mic,       label: 'Ask AI',            sub: 'Voice assistant', color: 'bg-emerald-50 text-emerald-700' },
            { to: '/scan',    icon: Camera,    label: 'Scan Crop',         sub: 'Disease detection', color: 'bg-blue-50 text-blue-700' },
            { to: '/tracker', icon: BarChart3, label: 'Resource Tracker',  sub: 'Costs & subsidies', color: 'bg-amber-50 text-amber-700' },
            { to: '/offline', icon: Download,  label: 'Offline Guides',    sub: 'Download advice', color: 'bg-purple-50 text-purple-700' },
          ].map(a => {
            const Icon = a.icon
            return (
              <Link key={a.to} to={a.to}
                className="bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all hover:-translate-y-1 p-6 group">
                <div className={`w-14 h-14 ${a.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={26} />
                </div>
                <p className="mb-1 text-sm font-black text-slate-900">{a.label}</p>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{a.sub}</p>
              </Link>
            )
          })}
        </div>
      </div>

    </div>
  )
}