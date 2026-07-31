const axios = require("axios");

const OWM_KEY = process.env.WEATHER_KEY;

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ── Alert & Recommendation builders ──────────────────────────────────────────

const buildAlerts = ({ temp, humidity, windSpeed, rainfall, condition, clouds }) => {
  const alerts = [];

  if (humidity > 80)
    alerts.push({ icon: "🦟", title: "Stem Borer Alert", desc: "High humidity increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.", severity: "high" });
  if (humidity > 75 && clouds > 60)
    alerts.push({ icon: "🍂", title: "Blast Disease Risk", desc: "Cloudy and humid — ideal for rice blast. Use Tricyclazole spray preventively.", severity: "medium" });
  if (condition === "Rain" || condition === "Thunderstorm" || rainfall > 10)
    alerts.push({ icon: "💧", title: "Waterlogging Warning", desc: "Heavy rainfall detected. Ensure drainage channels are clear to prevent root rot.", severity: "high" });
  if (temp > 35)
    alerts.push({ icon: "🌡️", title: "Heat Stress Alert", desc: `Temperature at ${Math.round(temp)}°C. Avoid field work 11am–3pm. Increase irrigation frequency.`, severity: "high" });
  if (windSpeed > 25)
    alerts.push({ icon: "💨", title: "High Wind Warning", desc: `Wind at ${Math.round(windSpeed)} km/h. Avoid spraying — drift risk.`, severity: "medium" });
  if (temp > 32 && humidity < 50 && condition === "Clear")
    alerts.push({ icon: "🐛", title: "Rhinoceros Beetle Risk", desc: "Dry and hot — check coconut crown for beetle damage.", severity: "medium" });
  if (humidity > 80 && temp > 25 && (condition === "Rain" || condition === "Drizzle"))
    alerts.push({ icon: "🌿", title: "Fungal Risk High", desc: "Wet and warm — apply copper fungicide to tomato and brinjal.", severity: "high" });

  return alerts;
};

const buildRecommendations = ({ temp, humidity, windSpeed, rainfall, condition, clouds }) => {
  const recommendations = [];

  if (condition === "Clouds" || clouds > 50)
    recommendations.push({ icon: "🌱", text: "Good time to apply basal fertilizer to paddy before rain.", tag: "Fertilizer" });
  if (condition === "Rain" || condition === "Drizzle" || rainfall > 5)
    recommendations.push({ icon: "🚿", text: `Skip irrigation today — natural rainfall of ${rainfall > 0 ? rainfall + "mm" : "rain"} expected.`, tag: "Water" });
  else if (temp > 35 && humidity < 40)
    recommendations.push({ icon: "🚿", text: "Hot and dry — increase irrigation frequency to prevent crop wilting.", tag: "Water" });
  if (rainfall > 15 || condition === "Thunderstorm")
    recommendations.push({ icon: "📦", text: "Heavy rainfall detected. Harvest ripe vegetables now to avoid damage.", tag: "Harvest" });
  if (humidity > 70 && (condition === "Clouds" || condition === "Drizzle"))
    recommendations.push({ icon: "🌿", text: "Apply fungicide spray before forecast rainfall.", tag: "Pest Control" });
  if (condition === "Clear" && windSpeed < 15)
    recommendations.push({ icon: "☀️", text: "Clear skies and calm wind — ideal conditions for pesticide or fertilizer spraying.", tag: "Pest Control" });
  if (temp > 34)
    recommendations.push({ icon: "🌡️", text: `High temperature (${Math.round(temp)}°C) — apply mulch around crops to retain soil moisture.`, tag: "Advisory" });

  return recommendations;
};

// ── AQI ──────────────────────────────────────────────────────────────────────

const AQI_LABELS = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

const fetchAQI = async (lat = 10.8505, lon = 76.2711) => {
  const cacheKey = `fetchAQI_${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/air_pollution`,
    { params: { lat, lon, appid: OWM_KEY } }
  );
  const item      = res.data.list[0];
  const aqiIndex  = item.main.aqi;
  const aqiValue  = [25, 75, 125, 200, 350][aqiIndex - 1] || 50;
  const data = {
    aqi:        aqiValue,
    label:      AQI_LABELS[aqiIndex - 1] || "Unknown",
    components: item.components,
  };
  setCache(cacheKey, data);
  return data;
};

// ── Hourly Forecast ───────────────────────────────────────────────────────────

const WEATHER_ICONS = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️",
  Drizzle: "🌦️", Thunderstorm: "⛈️", Snow: "❄️",
  Mist: "🌫️", Fog: "🌫️",
};

const fetchHourlyForecast = async (lat = 10.8505, lon = 76.2711) => {
  const cacheKey = `fetchHourlyForecast_${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [openMeteoRes, owmRes] = await Promise.allSettled([
    axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&timezone=Asia%2FKolkata&forecast_days=1`
    ),
    axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      { params: { lat, lon, units: "metric", cnt: 8, appid: OWM_KEY } }
    ),
  ]);

  let currentUVI = 0;
  if (openMeteoRes.status === "fulfilled") {
    const currentHour = new Date().getHours();
    currentUVI = openMeteoRes.value.data.hourly?.uv_index?.[currentHour] ?? 0;
  }

  let hourlySlots = [];
  if (owmRes.status === "fulfilled") {
    hourlySlots = owmRes.value.data.list.map((h) => ({
      time: new Date(h.dt * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      temp: h.main.temp,
      rain: h.rain?.["3h"] ?? 0,
      icon: WEATHER_ICONS[h.weather[0].main] || "🌤️",
      description: h.weather[0].description,
      pop:  h.pop ?? 0,
    }));
  }

  const data = { current: { uvi: currentUVI }, hourly: hourlySlots };
  setCache(cacheKey, data);
  return data;
};

module.exports = { buildAlerts, buildRecommendations, fetchAQI, fetchHourlyForecast };
