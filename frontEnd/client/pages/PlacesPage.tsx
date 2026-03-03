import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const greenIcon = new L.Icon({
  iconUrl:       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

const userIcon = new L.Icon({
  iconUrl:       'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
})

interface Place {
  id: number | string
  name: string
  type: string
  lat: number
  lon: number
  phone: string | null
  address: string | null
  distance?: number | null
}

const typeLabel: Record<string, string> = {
  government:   ' Govt Office',
  agricultural: ' Agri Office',
  agrarian:     ' Agri Shop',
  agri:         ' Agri Center',
}

const KERALA_BOUNDS = { minLat: 8.17, maxLat: 12.79, minLon: 74.85, maxLon: 77.42 }
const isInKerala = (lat: number, lon: number) =>
  lat >= KERALA_BOUNDS.minLat && lat <= KERALA_BOUNDS.maxLat &&
  lon >= KERALA_BOUNDS.minLon && lon <= KERALA_BOUNDS.maxLon

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Fetch directly from Nominatim in the browser — works fine, no 403
async function fetchFromNominatim(lat: number, lon: number, radius: number): Promise<Place[]> {
  const keywords = ['Krishi Bhavan', 'Agriculture Office', 'Krishi Vigyan Kendra']
  const seen = new Set<string>()
  const results: Place[] = []

  for (const q of keywords) {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', q)
    url.searchParams.set('format', 'json')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('limit', '20')
    url.searchParams.set('countrycodes', 'in')
    url.searchParams.set('viewbox', `${lon - 2},${lat + 2},${lon + 2},${lat - 2}`)
    url.searchParams.set('bounded', '1')

    const res = await fetch(url.toString())
    const data = await res.json()

    for (const el of data) {
      if (seen.has(el.place_id)) continue
      seen.add(el.place_id)
      results.push({
        id:      el.place_id,
        name:    el.display_name.split(',')[0],
        type:    'government',
        lat:     parseFloat(el.lat),
        lon:     parseFloat(el.lon),
        phone:   null,
        address: el.address
          ? [el.address.road, el.address.town || el.address.city || el.address.county]
              .filter(Boolean).join(', ')
          : el.display_name.split(',').slice(1, 3).join(',').trim(),
      })
    }

    // Nominatim rate limit: 1 req/sec
    await new Promise(r => setTimeout(r, 1100))
  }

  return results
}

function FlyTo({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lon], 15, { duration: 1.2 }) }, [lat, lon])
  return null
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.flyTo(center, 11, { duration: 1.5 }) }, [center[0], center[1]])
  return null
}

export default function PlacesPage() {
  const [places,        setPlaces]        = useState<Place[]>([])
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [selected,      setSelected]      = useState<Place | null>(null)
  const [userPos,       setUserPos]       = useState<[number, number] | null>(null)
  const [mapCenter,     setMapCenter]     = useState<[number, number]>([10.8505, 76.2711])
  const [locating,      setLocating]      = useState(false)
  const [search,        setSearch]        = useState('')
  const [citySearch,    setCitySearch]    = useState('')
  const [outsideKerala, setOutsideKerala] = useState(false)
  const [cityLoading,   setCityLoading]   = useState(false)
  const [radius,        setRadius]        = useState(20000)

  const fetchPlaces = async (lat: number, lon: number, r = radius) => {
    setLoading(true)
    setError('')
    setSelected(null)
    try {
      const data = await fetchFromNominatim(lat, lon, r)
      if (data.length === 0) {
        setError('No agricultural centers found in this area. Try increasing the search radius.')
      }
      setPlaces(data)
    } catch (err) {
      setError('Failed to load places. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlaces(10.8505, 76.2711) }, [])

  const locateMe = () => {
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lon } = pos.coords
        setUserPos([lat, lon])
        setMapCenter([lat, lon])
        setOutsideKerala(!isInKerala(lat, lon))
        fetchPlaces(lat, lon)
        setLocating(false)
      },
      err => {
        setError(
          err.code === 1
            ? 'Location permission denied. Please allow location access or search by city.'
            : 'Could not get your location. Try searching by city name.'
        )
        setLocating(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  const searchByCity = async () => {
    if (!citySearch.trim()) return
    setCityLoading(true)
    setError('')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(citySearch + ', India')}&format=json&limit=1`
      )
      const data = await res.json()
      if (!data.length) {
        setError(`Could not find "${citySearch}". Try a different city or district name.`)
        return
      }
      const lat = parseFloat(data[0].lat)
      const lon = parseFloat(data[0].lon)
      setMapCenter([lat, lon])
      setUserPos([lat, lon])
      setOutsideKerala(!isInKerala(lat, lon))
      fetchPlaces(lat, lon)
    } catch {
      setError('City search failed. Please try again.')
    } finally {
      setCityLoading(false)
    }
  }

  const filtered = places
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.address || '').toLowerCase().includes(search.toLowerCase())
    )
    .map(p => ({
      ...p,
      distance: userPos ? haversineKm(userPos[0], userPos[1], p.lat, p.lon) : null,
    }))
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 section-title">📍 Agricultural Places</h1>
        <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>കൃഷി കേന്ദ്രങ്ങൾ</p>
        <p className="mt-1 text-gray-600">Find Krishi Bhavans, farm support centers, and more</p>
      </div>

      {outsideKerala && (
        <div className="p-3 mb-4 text-sm text-blue-800 border border-blue-200 bg-blue-50 rounded-xl">
           You're outside Kerala — showing nearest agricultural offices in your area.
        </div>
      )}

      <div className="flex flex-col gap-3 mb-3 sm:flex-row">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search places…" className="flex-1 input-field"
        />
        <button onClick={locateMe} disabled={locating}
          className="flex items-center justify-center gap-2 px-5 btn-primary whitespace-nowrap">
          {locating
            ? <><div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> Locating…</>
            : ' Near Me'}
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-4 sm:flex-row">
        <input
          type="text" value={citySearch} onChange={e => setCitySearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchByCity()}
          placeholder="Or enter any city / district in India…"
          className="flex-1 text-sm input-field"
        />
        <button onClick={searchByCity} disabled={cityLoading || !citySearch.trim()}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all rounded-xl bg-forest-600 hover:bg-forest-700 disabled:opacity-50 whitespace-nowrap">
          {cityLoading
            ? <><div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin" /> Searching…</>
            : ' Search City'}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 text-sm text-gray-600">
        <span>Search radius:</span>
        {[10000, 20000, 50000].map(r => (
          <button key={r} onClick={() => { setRadius(r); const pos = userPos ?? [10.8505, 76.2711]; fetchPlaces(pos[0], pos[1], r) }}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${radius === r ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-300 text-gray-600 hover:border-forest-400'}`}>
            {r / 1000} km
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl"> {error}</div>
      )}

      <div className="mb-6 overflow-hidden border shadow-md rounded-2xl border-forest-200" style={{ height: '380px' }}>
        <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={mapCenter} />
          {userPos && (
            <>
              <Marker position={userPos} icon={userIcon}><Popup> Your location</Popup></Marker>
              <Circle center={userPos} radius={radius}
                pathOptions={{ color: '#2d6a4f', fillColor: '#52b788', fillOpacity: 0.08, weight: 1 }} />
            </>
          )}
          {filtered.map(p => (
            <Marker key={p.id} position={[p.lat, p.lon]} icon={greenIcon}
              eventHandlers={{ click: () => setSelected(p) }}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-gray-500">{typeLabel[p.type] || ' Agri Center'}</p>
                  {p.address  && <p className="mt-1 text-gray-500">{p.address}</p>}
                  {p.distance != null && <p className="mt-1 font-medium text-blue-500"> {p.distance.toFixed(1)} km away</p>}
                </div>
              </Popup>
            </Marker>
          ))}
          {selected && <FlyTo lat={selected.lat} lon={selected.lon} />}
        </MapContainer>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="border-4 rounded-full w-7 h-7 border-forest-500 border-t-transparent animate-spin" />
          <p className="font-medium text-forest-700">Finding agricultural centers…</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="mb-3 text-sm text-gray-500">
          Found <span className="font-semibold text-forest-700">{filtered.length}</span> agricultural centers
          {userPos && ' · sorted by distance'}{search && ` matching "${search}"`}
        </p>
      )}

      {!loading && !error && places.length === 0 && (
        <div className="py-16 text-center text-gray-500">
          <p className="mb-3 text-5xl"></p>
          <p className="text-lg">No places found</p>
          <p style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>സ്ഥലങ്ങൾ കണ്ടെത്തിയില്ല</p>
          <p className="mt-2 text-sm">Try "Near Me", search a city, or increase the radius</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelected(p)}
            className={`card p-4 cursor-pointer transition-all hover:shadow-md hover:border-forest-300 ${selected?.id === p.id ? 'border-forest-500 bg-forest-50' : ''}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🌿</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-forest-600 mt-0.5">{typeLabel[p.type] || '🌱 Agri Center'}</p>
                {p.address && <p className="mt-1 text-xs text-gray-400 truncate"> {p.address}</p>}
                {p.phone   && <a href={`tel:${p.phone}`} onClick={e => e.stopPropagation()}
                  className="block mt-1 text-xs text-forest-600 hover:underline"> {p.phone}</a>}
                {p.distance != null && <p className="mt-1 text-xs font-medium text-blue-500"> {p.distance.toFixed(1)} km away</p>}
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); setSelected(p) }}
              className="mt-3 w-full text-xs font-medium text-forest-600 bg-forest-50 hover:bg-forest-100 border border-forest-200 rounded-lg py-1.5 transition-all">
              View on map →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}