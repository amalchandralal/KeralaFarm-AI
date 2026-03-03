import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Kerala crop calendar
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

const WEATHER = {
  temp: 29,
  humidity: 84,
  condition: "Partly Cloudy",
  rainfall: "12mm expected",
  wind: "18 km/h SW",
  forecast: [
    { day: "Today", icon: "⛅", high: 29, low: 24, rain: "40%" },
    { day: "Tue", icon: "🌧️", high: 27, low: 23, rain: "80%" },
    { day: "Wed", icon: "🌧️", high: 26, low: 22, rain: "90%" },
    { day: "Thu", icon: "⛅", high: 28, low: 23, rain: "30%" },
    { day: "Fri", icon: "☀️", high: 31, low: 25, rain: "10%" },
  ],
};

const RECOMMENDATIONS = [
  {
    icon: "🌱",
    text: "Good time to apply basal fertilizer to paddy before rain tomorrow.",
    tag: "Fertilizer",
  },
  {
    icon: "🚿",
    text: "Skip irrigation today — natural rainfall of 12mm expected.",
    tag: "Water",
  },
  {
    icon: "📦",
    text: "Harvest ripe vegetables before Wednesday heavy rain to avoid damage.",
    tag: "Harvest",
  },
  {
    icon: "🌿",
    text: "Apply fungicide spray today before forecast rainfall.",
    tag: "Pest Control",
  },
];

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
  const [time, setTime] = useState(new Date());
  const [dashboard, setDashboard] = useState<any>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch("http://localhost:5000/dashboard");

      const data = await res.json();

      setDashboard(data);
    };

    fetchDashboard();
  }, []);

  const alerts = CROP_ALERTS[selectedCrop] || [];
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
            <p className="text-sm text-forest-200">{greeting} 👋</p>
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
              {dashboard?.weather?.main?.temp || WEATHER.temp}°C
            </p>
            
            <p className="text-sm text-forest-200">{WEATHER.condition}</p>
            <p className="text-xs text-forest-200">Kerala</p>
          </div>
        </div>

        {/* Mini weather strip */}
        <div className="flex gap-3 pb-1 mt-5 overflow-x-auto">
          {WEATHER.forecast.map((f) => (
            <div
              key={f.day}
              className="flex-shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center min-w-[64px]"
            >
              <p className="text-xs text-forest-200">{f.day}</p>
              <p className="my-1 text-xl">{f.icon}</p>
              <p className="text-xs font-bold">{f.high}°</p>
              <p className="text-xs text-forest-300">🌧 {f.rain}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: "💧",
            label: "Humidity",
            value: `${WEATHER.humidity}%`,
            sub: "High",
          },
          { icon: "🌧️", label: "Rainfall", value: "12mm", sub: "Expected" },
          { icon: "💨", label: "Wind", value: "18km/h", sub: "SW" },
        ].map((s) => (
          <div key={s.label} className="p-3 text-center card">
            <p className="mb-1 text-2xl">{s.icon}</p>
            <p className="text-sm font-bold text-forest-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Crop Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-forest-800">🚨 Crop Alerts</h2>
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
        </div>
        <div className="space-y-3">
          {alerts.map((a, i) => (
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
      </div>

      {/* Today's Recommendations */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">
          ✅ Today's Recommendations
        </h2>
        <div className="space-y-2">
          {RECOMMENDATIONS.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-4 card">
              <span className="flex-shrink-0 text-2xl">{r.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{r.text}</p>
              </div>
              <span className="flex-shrink-0 text-xs badge bg-forest-100 text-forest-700">
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">
          ⚡ Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              to: "/voice",
              icon: "🎤",
              label: "Ask AI",
              sub: "Voice assistant",
            },
            {
              to: "/scan",
              icon: "📷",
              label: "Scan Crop",
              sub: "Disease detection",
            },
            {
              to: "/tracker",
              icon: "📊",
              label: "Resource Tracker",
              sub: "Costs & subsidies",
            },
            {
              to: "/offline",
              icon: "📥",
              label: "Offline Guides",
              sub: "Download advice",
            },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="p-4 transition-all card hover:shadow-lg hover:-translate-y-1"
            >
              <p className="mb-2 text-3xl">{a.icon}</p>
              <p className="text-sm font-bold text-forest-700">{a.label}</p>
              <p className="text-xs text-gray-400">{a.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
