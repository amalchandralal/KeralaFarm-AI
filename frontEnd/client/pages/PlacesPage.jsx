import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Search, Info, AlertCircle } from "lucide-react";
import { getPlaces } from "../services/api";

// --- 1. Leaflet Icon Fix (Critical for React) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- 2. Distance Calculator ---
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// --- 3. Map Helper (Makes the map move) ---
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 12, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [userPos, setUserPos] = useState(null); // [lat, lon]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // --- 4. Main Search Function (Calls your Backend) ---
  const performSearch = useCallback(async (params = {}) => {
    setHasSearched(true);
    setLoading(true);
    setError("");
    try {
      const data = await getPlaces(params);

      // Update Center
      setUserPos(data.center);

      // Process results: add distance and sort
      const processed = data.places
        .map((p) => ({
          ...p,
          distance: haversineKm(data.center[0], data.center[1], p.lat, p.lon),
        }))
        .sort((a, b) => a.distance - b.distance);

      setPlaces(processed);
      if (processed.length === 0)
        setError("No offices found. Try a broader search.");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.error ||
        err.message ||
        "Could not find offices in this area.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle "Use My Location"
  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not available. Please search by city.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        performSearch({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        setError(
          "Location access denied or unavailable. Please search by city.",
        );
      },
    );
  }, [performSearch]);

  // Handle "Search" Button
  const handleCitySearch = () => {
    if (citySearch.trim()) {
      performSearch({ city: citySearch.trim() });
    } else {
      setError("Please enter a city name to search.");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-12 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <MapPin />
            </div>
            Agricultural Offices
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Find Krishi Bhavans and support centers near you
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          <div className="flex gap-2 md:col-span-2">
            <input
              type="text"
              placeholder="Search city (e.g. Kollam, Palakkad, Bokaro)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
              className="flex-1 px-4 py-3 transition-all bg-white border outline-none border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleCitySearch}
              disabled={loading}
              className="flex items-center gap-2 px-8 font-bold text-white transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-emerald-100 disabled:opacity-50"
            >
              <Search size={18} /> {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <button
            onClick={locateMe}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 font-bold transition-all bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 disabled:opacity-50"
          >
            <Navigation size={18} /> Use My Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm font-bold text-red-600 border border-red-100 bg-red-50 rounded-2xl">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Map Section */}
        <div className="h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-12 z-0 relative">
          {userPos ? (
            <MapContainer center={userPos} zoom={12} className="w-full h-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* This component forces the map to fly to new locations */}
              <MapUpdater center={userPos} />

              <Marker position={userPos} />

              {places.map((p) => (
                <Marker
                  key={p.id}
                  position={[p.lat, p.lon]}
                  icon={greenIcon}
                  eventHandlers={{ click: () => setSelectedPlace(p) }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">
                        {p.distance.toFixed(1)} km away
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500">
              {hasSearched ? (
                <p className="text-base font-medium">
                  No location selected yet. Use the search box or location
                  button above.
                </p>
              ) : (
                <p className="text-base font-medium">
                  Search for a city or use your location to load offices.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Nearby Results ({places.length})
            </h2>
            {loading && (
              <div className="w-6 h-6 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin" />
            )}
          </div>

          {!loading && places.length === 0 ? (
            <div className="p-16 text-center bg-white border-2 border-dashed rounded-[2rem] border-slate-200">
              <Info className="mx-auto mb-4 text-slate-300" size={40} />
              <p className="font-bold text-slate-400">
                {hasSearched
                  ? "No offices found in this area. Try searching for a nearby district or state."
                  : "Enter a city or use your location to load agricultural offices."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {places.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setUserPos([p.lat, p.lon]);
                    setSelectedPlace(p);
                  }}
                  className={`bg-white p-6 rounded-[2rem] border-2 transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${selectedPlace?.id === p.id ? "border-emerald-500 ring-4 ring-emerald-50" : "border-white"}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                      <MapPin size={22} />
                    </div>
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      {p.distance.toFixed(1)} km
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold leading-tight text-slate-900 line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mb-6 text-xs leading-relaxed text-slate-400 line-clamp-2">
                    {p.address}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-3 text-xs font-bold text-center transition-all rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-600"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
