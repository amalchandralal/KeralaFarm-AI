import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Search, Info, AlertCircle } from "lucide-react";
import { getPlaces } from "../services/api";
import PlaceCard from "../components/PlaceCard";

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
    <div className="min-h-screen px-4 pt-24 pb-12 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Agricultural Offices
          </h1>
          <p className="mt-1 text-gray-500">
            Find Krishi Bhavans and support centers near you
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search city (e.g. Kollam, Palakkad)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={handleCitySearch}
            disabled={loading}
            className="px-6 py-2.5 font-medium text-white transition-colors bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={locateMe}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Navigation size={18} /> Use My Location
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
          {/* Map Section (60%) */}
          <div className="w-full lg:w-[60%] h-[400px] lg:h-full rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0 relative">
            {userPos ? (
              <MapContainer center={userPos} zoom={12} className="w-full h-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

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
                        <p className="font-semibold text-gray-900">{p.name}</p>
                        <p className="text-xs font-medium text-emerald-600 mt-1">
                          {p.distance.toFixed(1)} km away
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                {hasSearched ? (
                  <p className="text-sm">
                    No location selected yet. Use the search box or location
                    button above.
                  </p>
                ) : (
                  <p className="text-sm">
                    Search for a city or use your location to load offices.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Results Section (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">
                Nearby Results {places.length > 0 && `(${places.length})`}
              </h2>
              {loading && (
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!loading && places.length === 0 ? (
                <div className="text-center py-12">
                  <Info className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-gray-500 text-sm">
                    {hasSearched
                      ? "No offices found in this area."
                      : "Search to see nearby offices."}
                  </p>
                </div>
              ) : (
                places.map((p) => (
                  <PlaceCard 
                    key={p.id} 
                    place={p} 
                    isSelected={selectedPlace?.id === p.id}
                    onClick={() => {
                      setUserPos([p.lat, p.lon]);
                      setSelectedPlace(p);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
