const axios = require("axios");

const OWM_KEY = process.env.WEATHER_KEY;
const LAT = process.env.LAT || 10.85;
const LON = process.env.LON || 76.27;

// ── Existing alert/recommendation logic ──────────────────────────────────────

const buildAlerts = ({ temp, humidity, windSpeed, rainfall, condition, clouds }) => {
  const alerts = [];

  if (humidity > 80)
    alerts.push({ title: "Stem Borer Alert", desc: "High humidity increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.", severity: "high" });
  if (humidity > 75 && clouds > 60)
    alerts.push({ title: "Blast Disease Risk", desc: "Cloudy and humid — ideal for rice blast. Use Tricyclazole spray preventively.", severity: "medium" });
  if (condition === "Rain" || condition === "Thunderstorm" || rainfall > 10)
    alerts.push({ title: "Waterlogging Warning", desc: "Heavy rainfall detected. Ensure drainage channels are clear to prevent root rot.", severity: "high" });
  if (temp > 35)
    alerts.push({ title: "Heat Stress Alert", desc: `Temperature at ${Math.round(temp)}°C. Avoid field work 11am–3pm. Increase irrigation frequency.`, severity: "high" });
  if (windSpeed > 25)
    alerts.push({ title: "High Wind Warning", desc: `Wind at ${Math.round(windSpeed)} km/h. Avoid spraying — drift risk.`, severity: "medium" });
  if (temp > 32 && humidity < 50 && condition === "Clear")
    alerts.push({ title: "Rhinoceros Beetle Risk", desc: "Dry and hot — check coconut crown for beetle damage.", severity: "medium" });
  if (humidity > 80 && temp > 25 && (condition === "Rain" || condition === "Drizzle"))
    alerts.push({ title: "Fungal Risk High", desc: "Wet and warm — apply copper fungicide to tomato and brinjal.", severity: "high" });

  return alerts;
};

const buildRecommendations = ({ temp, humidity, windSpeed, rainfall, condition, clouds }) => {
  const recommendations = [];

  if (condition === "Clouds" || clouds > 50)
    recommendations.push({ text: "Good time to apply basal fertilizer to paddy before rain.", tag: "Fertilizer" });
  if (condition === "Rain" || condition === "Drizzle" || rainfall > 5)
    recommendations.push({ text: `Skip irrigation today — natural rainfall of ${rainfall > 0 ? rainfall + "mm" : "rain"} expected.`, tag: "Water" });
  else if (temp > 35 && humidity < 40)
    recommendations.push({ text: "Hot and dry — increase irrigation frequency to prevent crop wilting.", tag: "Water" });
  if (rainfall > 15 || condition === "Thunderstorm")
    recommendations.push({ text: "Heavy rainfall detected. Harvest ripe vegetables now to avoid damage.", tag: "Harvest" });
  if (humidity > 70 && (condition === "Clouds" || condition === "Drizzle"))
    recommendations.push({ text: "Apply fungicide spray before forecast rainfall.", tag: "Pest Control" });
  if (condition === "Clear" && windSpeed < 15)
    recommendations.push({ text: "Clear skies and calm wind — ideal conditions for pesticide or fertilizer spraying.", tag: "Pest Control" });
  if (temp > 34)
    recommendations.push({ text: `High temperature (${Math.round(temp)}°C) — apply mulch around crops to retain soil moisture.`, tag: "Advisory" });

  return recommendations;
};

// ── Fetch AQI from OWM Air Pollution API ─────────────────────────────────────

const fetchAQI = async () => {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}`;
  const { data } = await axios.get(url);
  return data;
};

// ── Fetch hourly forecast ─────────────────────────────────────────────────────
// UV Index  → Open-Meteo (free, no key needed)
// Rain/temp → OWM /forecast (free tier)

const fetchHourlyForecast = async () => {
  const [openMeteoRes, owmRes] = await Promise.allSettled([
    axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=uv_index&timezone=Asia%2FKolkata&forecast_days=1`
    ),
    axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&cnt=8&appid=${OWM_KEY}`
    ),
  ]);

  // Current hour UV from Open-Meteo
  let currentUVI = 0;
  if (openMeteoRes.status === "fulfilled") {
    const currentHour = new Date().getHours();
    currentUVI = openMeteoRes.value.data.hourly?.uv_index?.[currentHour] ?? 0;
  } else {
    console.warn("Open-Meteo UV fetch failed:", openMeteoRes.reason?.message);
  }

  // Hourly slots from OWM /forecast
  let hourlySlots = [];
  if (owmRes.status === "fulfilled") {
    hourlySlots = owmRes.value.data.list.map((h) => ({
      dt:   h.dt,
      temp: h.main.temp,
      pop:  h.pop  ?? 0,
      rain: h.rain ?? {},
      uvi:  0,
    }));
  } else {
    console.warn("OWM forecast fetch failed:", owmRes.reason?.message);
  }

  return {
    current: { uvi: currentUVI },
    hourly:  hourlySlots,
  };
};

module.exports = { buildAlerts, buildRecommendations, fetchAQI, fetchHourlyForecast };