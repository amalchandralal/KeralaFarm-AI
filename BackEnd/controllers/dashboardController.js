const axios = require("axios");
const { buildAlerts, buildRecommendations, fetchAQI, fetchHourlyForecast } = require("../services/weatherService");

const getDashboard = async (req, res) => {
  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=10.8505&lon=76.2711&appid=${process.env.WEATHER_KEY}&units=metric`
    );
    const w = weatherRes.data;

    const params = {
      temp:      w.main.temp,
      humidity:  w.main.humidity,
      windSpeed: w.wind.speed * 3.6,
      rainfall:  w.rain?.["1h"] ?? w.rain?.["3h"] ?? 0,
      condition: w.weather[0].main,
      clouds:    w.clouds.all,
    };

    res.json({
      weather:         w,
      alerts:          buildAlerts(params),
      recommendations: buildRecommendations(params),
    });
  } catch (err) {
    console.error(err.response?.data);
    res.status(500).json({ error: "Weather API failed" });
  }
};

const getAQI = async (req, res) => {
  try {
    const data = await fetchAQI();
    res.json(data);
  } catch (err) {
    console.error("AQI controller error:", err.message);
    res.status(500).json({ error: "Failed to fetch AQI data" });
  }
};

const getHourlyForecast = async (req, res) => {
  try {
    const data = await fetchHourlyForecast();
    res.json(data);
  } catch (err) {
    console.error("Hourly forecast controller error:", err.message);
    res.status(500).json({ error: "Failed to fetch hourly forecast" });
  }
}; // ← this was missing

module.exports = { getDashboard, getAQI, getHourlyForecast };