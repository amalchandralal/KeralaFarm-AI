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

module.exports = { buildAlerts, buildRecommendations };