
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Kerala crop calendar (static fallback alerts)
const CROP_ALERTS: Record<
  string,
  {
    icon: string;
    title: string;
    desc: string;
    severity: "high" | "medium" | "low";
  }[]
> = {
  paddy: [
    {
      icon: "🦟",
      title: "Stem Borer Alert",
      desc: "High humidity (>80%) increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.",
      severity: "high",
    },
    {
      icon: "🍂",
      title: "Blast Disease Risk",
      desc: "Cool nights with heavy dew — ideal for rice blast. Use Tricyclazole spray preventively.",
      severity: "medium",
    },
    {
      icon: "💧",
      title: "Waterlogging Warning",
      desc: "Heavy rainfall forecast. Ensure drainage channels are clear to prevent root rot.",
      severity: "high",
    },
  ],
  coconut: [
    {
      icon: "🐛",
      title: "Rhinoceros Beetle",
      desc: "Dry weather followed by rain increases beetle activity. Check crown for damage.",
      severity: "medium",
    },
    {
      icon: "🌿",
      title: "Bud Rot Risk",
      desc: "Wet conditions favor bud rot. Apply Bordeaux mixture to crown as preventive measure.",
      severity: "low",
    },
  ],
  banana: [
    {
      icon: "🍌",
      title: "Panama Wilt Watch",
      desc: "Avoid flood irrigation. Panama wilt spreads through waterlogged soil.",
      severity: "high",
    },
    {
      icon: "🦠",
      title: "Sigatoka Disease",
      desc: "Overcast weather conditions — monitor leaves for yellow streaks.",
      severity: "medium",
    },
  ],
  vegetable: [
    {
      icon: "🐌",
      title: "Aphid Surge",
      desc: "Humidity spike expected. Spray Neem oil solution (5ml/L) on vegetable crops.",
      severity: "medium",
    },
    {
      icon: "🌧️",
      title: "Fungal Risk High",
      desc: "Continuous rain forecast. Apply copper fungicide to tomato and brinjal.",
      severity: "high",
    },
  ],
};

// Fallback static forecast (no forecast in API)
const STATIC_FORECAST = [
  { day: "Today", icon: "⛅", high: 29, low: 24, rain: "40%" },
  { day: "Tue", icon: "🌧️", high: 27, low: 23, rain: "80%" },
  { day: "Wed", icon: "🌧️", high: 26, low: 22, rain: "90%" },
  { day: "Thu", icon: "⛅", high: 28, low: 23, rain: "30%" },
  { day: "Fri", icon: "☀️", high: 31, low: 25, rain: "10%" },
];

// Map OWM weather condition to emoji
function conditionIcon(main: string): string {
  const map: Record<string, string> = {
    Clear: "☀️",
    Clouds: "⛅",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌫️",
  };
  return map[main] || "🌤️";
}

// Severity for API alerts (guess from message content if not provided)
function guessSeverity(alert: any): "high" | "medium" | "low" {
  if (alert.severity) return alert.severity;
  const text = (alert.title + " " + alert.desc).toLowerCase();
  if (text.includes("high") || text.includes("warning") || text.includes("danger")) return "high";
  if (text.includes("medium") || text.includes("moderate") || text.includes("risk")) return "medium";
  return "low";
}

// Tag for API recommendations
function guessTag(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("fertilizer") || lower.includes("basal")) return "Fertilizer";
  if (lower.includes("irrigat") || lower.includes("water") || lower.includes("rainfall")) return "Water";
  if (lower.includes("harvest")) return "Harvest";
  if (lower.includes("fungicide") || lower.includes("pest") || lower.includes("spray") || lower.includes("neem")) return "Pest Control";
  if (lower.includes("sow") || lower.includes("plant") || lower.includes("seed")) return "Planting";
  return "Advisory";
}

function guessRecommendationIcon(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("fertilizer") || lower.includes("basal")) return "🌱";
  if (lower.includes("irrigat") || lower.includes("water") || lower.includes("rainfall")) return "🚿";
  if (lower.includes("harvest")) return "📦";
  if (lower.includes("fungicide") || lower.includes("pest") || lower.includes("spray")) return "🌿";
  return "✅";
}

const severityColor = {
  high: "border-red-400 bg-red-50",
  medium: "border-yellow-400 bg-yellow-50",
  low: "border-green-400 bg-green-50",
};
const severityBadge = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState("paddy");
  const [time] = useState(new Date());
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard");
        const data = await res.json();
        setDashboard(data);
        console.log("Dashboard API Data:", data)
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // --- Derive live weather values ---
  const weatherMain = dashboard?.weather?.main;
  const weatherCondition = dashboard?.weather?.weather?.[0];
  const weatherWind = dashboard?.weather?.wind;

  const temp = weatherMain?.temp != null ? Math.round(weatherMain.temp) : "—";
  const humidity = weatherMain?.humidity != null ? `${weatherMain.humidity}%` : "—";
  const windSpeed = weatherWind?.speed != null ? `${Math.round(weatherWind.speed * 3.6)}km/h` : "—";
  const conditionLabel = weatherCondition?.main
    ? weatherCondition.main.replace(/([A-Z])/g, " $1").trim()
    : "—";

  // Rainfall: OWM provides rain.1h or rain.3h (mm), fallback to "—"
  const rainfallRaw = dashboard?.weather?.rain;
  const rainfall = rainfallRaw
    ? `${rainfallRaw["1h"] ?? rainfallRaw["3h"] ?? 0}mm`
    : "0mm";

  // --- Alerts: prefer API alerts, fallback to static crop alerts ---
  const apiAlerts: any[] = dashboard?.alerts ?? [];
  const hasApiAlerts = apiAlerts.length > 0;

  const staticAlerts = CROP_ALERTS[selectedCrop] || [];

  // --- Recommendations from API ---
  const apiRecommendations: any[] = dashboard?.recommendations ?? [];

  const greeting =
    time.getHours() < 12
      ? "Good Morning"
      : time.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <div className="space-y-6 page-container">
      {/* Welcome Header */}
      <div className="p-6 text-white bg-gradient-to-r from-forest-700 to-forest-500 rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-forest-200">{greeting} </p>
            <h1 className="mt-1 text-2xl font-bold">
              {user?.name || "Farmer"}
            </h1>
            <p
              className="mt-1 text-sm text-forest-200"
              style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}
            >
              ഇന്നത്തെ കൃഷി വിവരങ്ങൾ
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {loading ? "…" : `${temp}°C`}
            </p>
            <p className="text-sm text-forest-200">
              {loading ? "Loading…" : conditionLabel}
            </p>
            <p className="text-xs text-forest-200">Kerala</p>
          </div>
        </div>

        {/* Mini weather strip — static forecast (OWM free tier needs separate forecast call) */}
        <div className="flex gap-3 pb-1 mt-5 overflow-x-auto">
          {STATIC_FORECAST.map((f) => (
            <div
              key={f.day}
              className="flex-shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center min-w-[64px]"
            >
              <p className="text-xs text-forest-200">{f.day}</p>
              <p className="my-1 text-xl">
                {f.day === "Today" && weatherCondition?.main
                  ? conditionIcon(weatherCondition.main)
                  : f.icon}
              </p>
              <p className="text-xs font-bold">
                {f.day === "Today" && temp !== "—" ? `${temp}°` : `${f.high}°`}
              </p>
              <p className="text-xs text-forest-300">🌧 {f.rain}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats — all live */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            
            label: "Humidity",
            value: loading ? "…" : humidity,
          },
          {
           
            label: "Rainfall",
            value: loading ? "…" : rainfall,
          },
          {
            
            label: "Wind",
            value: loading ? "…" : windSpeed,
          },
        ].map((s) => (
          <div key={s.label} className="p-3 text-center card">
            <p className="mb-1 text-2xl"></p>
            <p className="text-sm font-bold text-forest-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Crop Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-forest-800"> Crop Alerts</h2>
          {/* Only show crop tabs when using static alerts */}
          {!hasApiAlerts && (
            <div className="flex gap-2 overflow-x-auto">
              {Object.keys(CROP_ALERTS).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors flex-shrink-0 ${
                    selectedCrop === c
                      ? "bg-forest-600 text-white"
                      : "bg-forest-100 text-forest-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="py-4 text-sm text-center text-gray-400">Loading alerts…</p>
        ) : hasApiAlerts ? (
          // Live alerts from API
          <div className="space-y-3">
            {apiAlerts.map((a: any, i: number) => {
              const sev = guessSeverity(a);
              return (
                <div
                  key={i}
                  className={`border-l-4 rounded-xl p-4 ${severityColor[sev]}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{a.icon }</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{a.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{a.desc || a.description}</p>
                      </div>
                    </div>
                    <span
                      className={`badge text-xs flex-shrink-0 capitalize ${severityBadge[sev]}`}
                    >
                      {sev}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Static fallback alerts by crop
          <div className="space-y-3">
            {staticAlerts.map((a, i) => (
              <div
                key={i}
                className={`border-l-4 rounded-xl p-4 ${severityColor[a.severity]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{a.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{a.desc}</p>
                    </div>
                  </div>
                  <span
                    className={`badge text-xs flex-shrink-0 capitalize ${severityBadge[a.severity]}`}
                  >
                    {a.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Recommendations */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">
           Today's Recommendations
        </h2>
        {loading ? (
          <p className="py-4 text-sm text-center text-gray-400">Loading recommendations…</p>
        ) : apiRecommendations.length > 0 ? (
          // Live recommendations from API
          <div className="space-y-2">
            {apiRecommendations.map((r: any, i: number) => {
              const text = r.text || r.message || r.description || JSON.stringify(r);
              const tag = r.tag || guessTag(text);
              const icon = r.icon || guessRecommendationIcon(text);
              return (
                <div key={i} className="flex items-start gap-3 p-4 card">
                  <span className="flex-shrink-0 text-2xl"></span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs badge bg-forest-100 text-forest-700">
                    {tag}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty state
          <p className="py-4 text-sm text-center text-gray-400">
            No recommendations available right now.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">
           Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              to: "/voice",
              
              label: "Ask AI",
              sub: "Voice assistant",
            },
            {
              to: "/scan",
              
              label: "Scan Crop",
              sub: "Disease detection",
            },
            {
              to: "/tracker",
              
              label: "Resource Tracker",
              sub: "Costs & subsidies",
            },
            {
              to: "/offline",
              
              label: "Offline Guides",
              sub: "Download advice",
            },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="p-4 transition-all card hover:shadow-lg hover:-translate-y-1"
            >
              <p className="mb-2 text-3xl"></p>
              <p className="text-sm font-bold text-forest-700">{a.label}</p>
              <p className="text-xs text-gray-400">{a.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}