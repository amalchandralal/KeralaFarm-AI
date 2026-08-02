import React, { useState, useCallback } from "react";
import { searchPlaces } from "../services/api";
import PlaceCard from "../components/PlaceCard";
import MapView from "../components/MapView";
import { Search, Navigation, AlertCircle, Loader2 } from "lucide-react";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [citySearch, setCitySearch] = useState("");
  const [searchLabel, setSearchLabel] = useState("");
  const [centerCoords, setCenterCoords] = useState(null);

  // Unified search function
  const performSearch = useCallback(async ({ city, lat, lon }) => {
    setLoading(true);
    setError("");
    setSelectedPlaceId(null);

    try {
      let data = [];
      let label = "";

      if (city) {
        data = await searchPlaces(city);
        label = `Offices in "${city}"`;
      } else if (lat && lon) {
        data = await searchPlaces(`${lat},${lon}`);
        label = "Offices near your location";
        setCenterCoords({ lat, lon });
      }

      // Ensure data is array
      const placeList = Array.isArray(data) ? data : [];

      // Filter out duplicate or incomplete entries
      const processed = placeList.map((p, idx) => ({
        ...p,
        _id: p._id || p.id || `place_${idx}`,
        lat: p.lat ? parseFloat(p.lat) : 0,
        lon: p.lon ? parseFloat(p.lon) : 0,
        name: p.name || p.display_name || "Krishi Bhavan",
        address: p.address || p.display_name || "Location details unavailable",
        distance: p.distance !== undefined ? parseFloat(p.distance) : undefined,
      })).filter(p => p.lat !== 0 && p.lon !== 0);

      setPlaces(processed);
      setSearchLabel(label);

      if (processed.length > 0 && !centerCoords) {
        setCenterCoords({ lat: processed[0].lat, lon: processed[0].lon });
      }

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
  }, [centerCoords]);

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
    <div className="min-h-screen px-4 pt-8 pb-12 mx-auto font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Agricultural Offices
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Find Krishi Bhavans and support centers near you
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search city (e.g. Kollam, Palakkad)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCitySearch}
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Search"}
            </button>

            <button
              onClick={locateMe}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Navigation size={18} className="text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Use My Location</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl">
            <AlertCircle size={20} className="flex-shrink-0 text-rose-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Content Layout (Map + List Split) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Map Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-20 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl h-[450px] lg:h-[600px] relative">
              {places.length > 0 ? (
                <MapView
                  places={places}
                  selectedId={selectedPlaceId}
                  onSelectPlace={(place) => setSelectedPlaceId(place._id)}
                  center={centerCoords}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-900/50">
                  <div className="p-4 mb-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm">
                    <Navigation size={32} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Search for a city or use your location to load offices.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Places List Column */}
          <div className="flex flex-col lg:col-span-5 xl:col-span-4 h-[600px]">
            <div className="flex-shrink-0 flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {searchLabel || "Nearby Results"}
              </h2>
              {places.length > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                  {places.length} found
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <Loader2 size={24} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Finding Krishi Bhavans...</p>
                </div>
              ) : places.length > 0 ? (
                places.map((place) => (
                  <PlaceCard
                    key={place._id}
                    place={place}
                    isSelected={selectedPlaceId === place._id}
                    onClick={() => {
                      setSelectedPlaceId(place._id);
                      setCenterCoords({ lat: place.lat, lon: place.lon });
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Search to see nearby offices.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
