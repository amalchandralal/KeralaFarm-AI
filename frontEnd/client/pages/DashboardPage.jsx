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
const severityIconColor = { 
  high: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40', 
  medium: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40', 
  low: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' 
}

const aqiColor = (aqi) => {
  if (aqi <= 50)  return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50'
  if (aqi <= 100) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/50'
  if (aqi <= 150) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50'
  return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/50'
}

// ─── Location Permission Banner ───────────────────────────────────────────────
const LocationBanner = ({ denied, error, onRetry }) => {
  if (!error) return null
  return (
    <div className={`rounded-2xl p-4 mb-6 flex items-start sm:items-center gap-3 text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
      denied 
        ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40' 
        : 'bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40'
    }`}>
      <MapPin size={20} className={`mt-0.5 sm:mt-0 flex-shrink-0 ${denied ? 'text-amber-500' : 'text-blue-500'}`} />
      <div className="flex-1">
        <p className={`font-medium ${denied ? 'text-amber-800 dark:text-amber-300' : 'text-blue-800 dark:text-blue-300'}`}>{error}</p>
        {denied && (
          <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
            Click the lock icon in your address bar to allow location access.
          </p>
        )}
      </div>
      <button onClick={onRetry} className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
        denied 
          ? 'bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-200' 
          : 'bg-blue-200/60 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 hover:bg-blue-200'
      }`}>
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuth()
  const { location, loading: locLoading, error: locError, permissionDenied, refresh: retryLocation } = useLocation()

  const [dashboardData, setDashboardData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [hourly, setHourly] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (locLoading) return

    const lat = location?.lat
    const lon = location?.lon

    const loadAll = async () => {
      setIsLoading(true)
      setApiError(null)
      try {
        const [dashRes, aqiRes, hourlyRes] = await Promise.allSettled([
          getDashboard(lat, lon),
          getAQI(lat, lon),
          getHourlyForecast(lat, lon)
        ])

        if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value)
        else setApiError(dashRes.reason?.response?.data?.error || 'Weather unavailable')

        if (aqiRes.status === 'fulfilled') setAqiData(aqiRes.value)
        if (hourlyRes.status === 'fulfilled') setHourly(hourlyRes.value || [])
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadAll()
  }, [location, locLoading])

  if (!user) return <Navigate to="/login" />

  const weather = dashboardData?.weather
  const locationName =
    (typeof dashboardData?.location === 'string' ? dashboardData.location : dashboardData?.location?.name) ||
    (location?.label ? location.label : null) ||
    (location?.lat != null && location?.lon != null ? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}` : 'Kerala')
  const alerts = dashboardData?.cropAlerts || []
  const recommendations = dashboardData?.recommendations || []
  const marketSummary = dashboardData?.marketPricesSummary || []

  const temp = Math.round(weather?.main?.temp ?? 28)
  const condition = weather?.weather?.[0]?.description ?? 'Clear Sky'
  const humidity = weather?.main?.humidity ?? 75
  const windSpeed = Math.round(weather?.wind?.speed ?? 12)
  const rainfall = dashboardData?.rainfall ?? 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 pb-16 transition-colors duration-200">
      
      {/* ── Top App Bar Header ── */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 sticky top-16 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{user?.name?.split(' ')[0] || 'Farmer'}</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>{locationName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={retryLocation} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw size={18} className={locLoading ? 'animate-spin' : ''} />
            </button>
            <Link to="/voice" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all">
              <Mic size={16} />
              <span>Ask Voice Assistant</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        <LocationBanner denied={permissionDenied} error={locError} onRetry={retryLocation} />

        {apiError && (
          <div className="flex items-center gap-3 p-4 mb-8 text-sm font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl">
            <AlertTriangle size={18} /> {apiError}
          </div>
        )}

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ─── LEFT COLUMN (Weather, Hourly, Actions) ─── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Hero Weather Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-800 dark:to-teal-950 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-900/10 text-white">
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

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { to: '/voice',   icon: Mic,       label: 'Ask AI',       color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50', hover: 'hover:border-blue-300 dark:hover:border-blue-700' },
                { to: '/scan',    icon: Camera,    label: 'Scan Crop',    color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50', hover: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
                { to: '/tracker', icon: BarChart3, label: 'Tracker',      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50', hover: 'hover:border-indigo-300 dark:hover:border-indigo-700' },
                { to: '/offline', icon: Download,  label: 'Offline Data', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700', hover: 'hover:border-slate-300 dark:hover:border-slate-600' },
              ].map(a => {
                const Icon = a.icon
                return (
                  <Link key={a.to} to={a.to}
                    className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${a.hover}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${a.color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{a.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Hourly Forecast */}
            {hourly.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Today's Forecast</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide -mx-2 px-2">
                  {hourly.slice(0, 12).map((h, i) => (
                    <div key={i} className="snap-start flex-shrink-0 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-2xl p-4 min-w-[90px] flex flex-col items-center justify-between transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-100 dark:hover:border-emerald-800/50 cursor-default">
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">{h.time}</p>
                      <div className="mb-3 text-slate-700 dark:text-slate-300">
                        <DynamicIcon name={h.icon} size={28} />
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100 stat-value">{Math.round(h.temp)}°</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Zap className="text-emerald-500" size={20} />
                  Recommended Farming Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon name={rec.icon} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1">
                          {rec.title || rec.tag || 'Advisory'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {rec.description || rec.text || rec.desc || ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ─── RIGHT COLUMN (AQI, Alerts, Market Summary) ─── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AQI Widget */}
            {aqiData && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Air Quality (AQI)</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${aqiColor(aqiData.aqi)}`}>
                    {aqiData.status}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 stat-value">{aqiData.aqi}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">PM2.5: {aqiData.pm25} µg/m³</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{aqiData.advice}</p>
              </div>
            )}

            {/* Crop Alerts List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Siren className="text-rose-500" size={20} />
                  Active Crop Alerts
                </h2>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  {alerts.length}
                </span>
              </div>

              <div className="space-y-3">
                {alerts.map((alert, idx) => {
                  const border = severityBorder[alert.severity] || 'border-l-emerald-500'
                  const iconStyle = severityIconColor[alert.severity] || 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                  return (
                    <div key={idx} className={`bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 border-l-4 ${border} rounded-2xl p-4 transition-all hover:bg-slate-100/60 dark:hover:bg-slate-800/60`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl flex-shrink-0 ${iconStyle}`}>
                          <DynamicIcon name={alert.icon} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{alert.title}</h3>
                            {alert.crop && (
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {alert.crop}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                            {alert.desc || alert.message || ''}
                          </p>
                          {alert.action && (
                            <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 p-2 rounded-xl">
                              💡 Action: {alert.action}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Market Prices Brief */}
            {marketSummary.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Kerala Market Highlights</h2>
                  <Link to="/tracker" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5">
                    View All <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {marketSummary.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.crop}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{item.market}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 stat-value">₹{item.price}/{item.unit}</p>
                        <p className={`text-[11px] font-medium ${item.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : item.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                          {item.trend === 'up' ? '▲ Up' : item.trend === 'down' ? '▼ Down' : '• Stable'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  )
}

export default DashboardPage