const axios = require("axios");
const logger = require("../../utils/logger");

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
const GRAPHHOPPER_KEY = process.env.GRAPHHOPPER_KEY;
const GH_GEOCODE_URL = "https://graphhopper.com/api/1/geocode";

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Google Places API Search ---
const googlePlacesSearch = async ({ lat, lon, city }) => {
  try {
    let targetLat = parseFloat(lat);
    let targetLon = parseFloat(lon);

    if (city) {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city + ", India")}&key=${GOOGLE_MAPS_API_KEY}`;
      const geoRes = await axios.get(geoUrl, { timeout: 10000 });
      if (geoRes.data?.results?.length > 0) {
        const loc = geoRes.data.results[0].geometry.location;
        targetLat = loc.lat;
        targetLon = loc.lng;
      }
    }

    if (isNaN(targetLat) || isNaN(targetLon)) return null;

    const query = city ? `Krishi Bhavan in ${city}` : "Krishi Bhavan Agriculture Office";
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${targetLat},${targetLon}&radius=15000&key=${GOOGLE_MAPS_API_KEY}`;
    
    const searchRes = await axios.get(searchUrl, { timeout: 10000 });
    const results = searchRes.data?.results || [];

    const processed = results.slice(0, 8).map((place, idx) => ({
      id: place.place_id || `gplace_${idx}`,
      name: place.name || "Agricultural Office",
      lat: place.geometry?.location?.lat || targetLat,
      lon: place.geometry?.location?.lng || targetLon,
      address: place.formatted_address || place.vicinity || "Address unavailable",
      rating: place.rating,
      distance: haversineKm(targetLat, targetLon, place.geometry?.location?.lat || targetLat, place.geometry?.location?.lng || targetLon)
    })).sort((a, b) => a.distance - b.distance);

    return { places: processed, center: [targetLat, targetLon] };
  } catch (err) {
    logger.error("Google Places API error:", err.message);
    return null;
  }
};

const geocodeCity = async (cityName) => {
  if (!GRAPHHOPPER_KEY) return null;
  try {
    const res = await axios.get(GH_GEOCODE_URL, {
      params: { q: `${cityName}, India`, locale: "en", limit: 1, key: GRAPHHOPPER_KEY },
      timeout: 10000,
    });
    if (res.data?.hits?.length > 0) {
      const hit = res.data.hits[0];
      return { lat: hit.point.lat, lon: hit.point.lng, name: hit.city || hit.name || cityName };
    }
  } catch (e) {
    logger.error("GraphHopper geocode failed:", e.message);
  }
  return null;
};

const nominatimSearch = async (query, viewbox) => {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: "20",
    countrycodes: "in",
  });
  if (viewbox) {
    params.append("viewbox", viewbox);
    params.append("bounded", "1");
  }
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": "AgroVision_Farm_Assistant/2.0", Accept: "application/json" },
      timeout: 10000,
    });
    return response.data || [];
  } catch (err) {
    if (err.response?.status === 429) {
      await delay(3000);
      try {
        const retry = await axios.get(url, {
          headers: { "User-Agent": "AgroVision_Farm_Assistant/2.0", Accept: "application/json" },
          timeout: 10000,
        });
        return retry.data || [];
      } catch { return []; }
    }
    logger.error(`Nominatim search failed for "${query}":`, err.message);
    return [];
  }
};

async function findNearbyPlaces({ lat, lon, city }) {
  // Try Google Places API first if Key exists
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== "") {
    const googleResult = await googlePlacesSearch({ lat, lon, city });
    if (googleResult && googleResult.places.length > 0) {
      return googleResult;
    }
  }

  let targetLat = lat ? parseFloat(lat) : NaN;
  let targetLon = lon ? parseFloat(lon) : NaN;
  let cityLabel = "";
  let isGPS = false;

  if (city) {
    const geo = await geocodeCity(city.trim());
    if (geo) {
      targetLat = geo.lat;
      targetLon = geo.lon;
      cityLabel = geo.name;
    } else {
      // Fallback geocode via Nominatim if GraphHopper key not present
      const nomGeo = await nominatimSearch(`${city.trim()}, India`, null);
      if (nomGeo?.length > 0) {
        targetLat = parseFloat(nomGeo[0].lat);
        targetLon = parseFloat(nomGeo[0].lon);
        cityLabel = city.trim();
      } else {
        throw { status: 404, message: `City "${city}" not found. Try a different spelling.` };
      }
    }
  } else if (!isNaN(targetLat) && !isNaN(targetLon)) {
    isGPS = true;
  } else {
    throw { status: 400, message: "Provide latitude/longitude or a city name." };
  }

  const results = [];
  const seen = new Set();

  const collect = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (!item?.lat || !item?.lon) continue;
      const id = item.place_id || `${item.osm_type}/${item.osm_id}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const name = item.display_name?.split(",")[0] || "Agricultural Office";
      const address = item.display_name
        ? item.display_name.split(",").slice(1, 4).join(",").trim()
        : "Address not available";
      results.push({ id, name, lat: parseFloat(item.lat), lon: parseFloat(item.lon), address });
    }
  };

  const keywords = ["Krishi Bhavan", "Agriculture Office", "Agriculture Department"];

  if (isGPS) {
    for (const radius of [0.3, 0.6, 1.0]) {
      if (results.length >= 4) break;
      const box = `${targetLon - radius},${targetLat + radius},${targetLon + radius},${targetLat - radius}`;
      for (const kw of keywords) {
        const items = await nominatimSearch(kw, box);
        collect(items);
        await delay(1100);
        if (results.length >= 6) break;
      }
    }
  } else {
    const box30 = `${targetLon - 0.3},${targetLat + 0.3},${targetLon + 0.3},${targetLat - 0.3}`;
    const box60 = `${targetLon - 0.6},${targetLat + 0.6},${targetLon + 0.6},${targetLat - 0.6}`;

    for (const kw of keywords) {
      collect(await nominatimSearch(`${cityLabel} ${kw}`, box30));
      await delay(1100);
    }
    if (results.length === 0) {
      for (const kw of keywords) {
        collect(await nominatimSearch(kw, box30));
        await delay(1100);
      }
    }
    if (results.length === 0) {
      for (const kw of keywords) {
        collect(await nominatimSearch(kw, box60));
        await delay(1100);
      }
    }
  }

  const sorted = results
    .map((p) => ({ ...p, distance: haversineKm(targetLat, targetLon, p.lat, p.lon) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  return { places: sorted, center: [targetLat, targetLon] };
}

module.exports = { findNearbyPlaces };
