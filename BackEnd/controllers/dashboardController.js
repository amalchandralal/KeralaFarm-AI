const axios = require("axios")
const { buildAlerts, buildRecommendations, fetchAQI, fetchHourlyForecast } = require("../services/weatherService")

const DEFAULT_LAT = 10.8505
const DEFAULT_LON = 76.2711

const parseCoords = (req) => {
  const lat = parseFloat(req.query.lat)
  const lon = parseFloat(req.query.lon)
  if (!isNaN(lat) && !isNaN(lon)) return { lat, lon, isDefault: false }
  return { lat: DEFAULT_LAT, lon: DEFAULT_LON, isDefault: true }
}

const getDashboard = async (req, res) => {
  const { lat, lon, isDefault } = parseCoords(req)
  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: process.env.WEATHER_KEY,
          units: "metric",
        },
      }
    )
    const w = weatherRes.data
    const params = {
      temp:      w.main.temp,
      humidity:  w.main.humidity,
      windSpeed: w.wind.speed * 3.6,
      rainfall:  w.rain?.["1h"] ?? w.rain?.["3h"] ?? 0,
      condition: w.weather[0].main,
      clouds:    w.clouds.all,
    }
    res.json({
      weather:         w,
      alerts:          buildAlerts(params),
      recommendations: buildRecommendations(params),
      location: { lat, lon, isDefault, name: w.name },
    })
  } catch (err) {
    console.error("Dashboard weather error:", err.response?.data || err.message)
    res.status(500).json({ error: "Weather API failed" })
  }
}

const getAQI = async (req, res) => {
  const { lat, lon } = parseCoords(req)
  try {
    const data = await fetchAQI(lat, lon)
    res.json(data)
  } catch (err) {
    console.error("AQI error:", err.message)
    res.status(500).json({ error: "Failed to fetch AQI data" })
  }
}

const getHourlyForecast = async (req, res) => {
  const { lat, lon } = parseCoords(req)
  try {
    const data = await fetchHourlyForecast(lat, lon)
    res.json(data)
  } catch (err) {
    console.error("Hourly forecast error:", err.message)
    res.status(500).json({ error: "Failed to fetch hourly forecast" })
  }
}

module.exports = { getDashboard, getAQI, getHourlyForecast }