import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAQI, getHourlyForecast } from "../services/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface IrrigationSlot {
  time: string;         // e.g. "06:00"
  action: "irrigate" | "skip" | "optional";
  reason: string;
  rainChance: number;   // 0–100
  temp: number;
}

// ── Kerala crop calendar (static fallback alerts) ────────────────────────────

const CROP_ALERTS: Record<
  string,
  { icon: string; title: string; desc: string; severity: "high" | "medium" | "low" }[]
> = {
  paddy: [
    { icon: " ", title: "Stem Borer Alert",     desc: "High humidity (>80%) increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.", severity: "high" },
    { icon: " ", title: "Blast Disease Risk",    desc: "Cool nights with heavy dew — ideal for rice blast. Use Tricyclazole spray preventively.",           severity: "medium" },
    { icon: " ", title: "Waterlogging Warning",  desc: "Heavy rainfall forecast. Ensure drainage channels are clear to prevent root rot.",                  severity: "high" },
  ],
  coconut: [
    { icon: " ", title: "Rhinoceros Beetle", desc: "Dry weather followed by rain increases beetle activity. Check crown for damage.",       severity: "medium" },
    { icon: " ", title: "Bud Rot Risk",      desc: "Wet conditions favor bud rot. Apply Bordeaux mixture to crown as preventive measure.", severity: "low" },
  ],
  banana: [
    { icon: " ", title: "Panama Wilt Watch", desc: "Avoid flood irrigation. Panama wilt spreads through waterlogged soil.",                     severity: "high" },
    { icon: " ", title: "Sigatoka Disease",  desc: "Overcast weather conditions — monitor leaves for yellow streaks.",                         severity: "medium" },
  ],
  vegetable: [
    { icon: " ", title: "Aphid Surge",      desc: "Humidity spike expected. Spray Neem oil solution (5ml/L) on vegetable crops.",     severity: "medium" },
    { icon: " ", title: "Fungal Risk High", desc: "Continuous rain forecast. Apply copper fungicide to tomato and brinjal.",            severity: "high" },
  ],
};

const STATIC_FORECAST = [
  { day: "Today", icon: " ", high: 29, low: 24, rain: "40%" },
  { day: "Tue",   icon: " ", high: 27, low: 23, rain: "80%" },
  { day: "Wed",   icon: " ", high: 26, low: 22, rain: "90%" },
  { day: "Thu",   icon: " ", high: 28, low: 23, rain: "30%" },
  { day: "Fri",   icon: " ", high: 31, low: 25, rain: "10%" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function conditionIcon(main: string): string {
  const map: Record<string, string> = {
    Clear: " ", Clouds: " ", Rain: " ", Drizzle: " ",
    Thunderstorm: " ", Snow: " ", Mist: " ", Fog: " ", Haze: " ",
  };
  return map[main] || " ";
}

function guessSeverity(alert: any): "high" | "medium" | "low" {
  if (alert.severity) return alert.severity;
  const text = (alert.title + " " + alert.desc).toLowerCase();
  if (text.includes("high") || text.includes("warning") || text.includes("danger")) return "high";
  if (text.includes("medium") || text.includes("moderate") || text.includes("risk")) return "medium";
  return "low";
}

function guessTag(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("fertilizer") || lower.includes("basal"))                         return "Fertilizer";
  if (lower.includes("irrigat") || lower.includes("water") || lower.includes("rainfall")) return "Water";
  if (lower.includes("harvest"))                                                        return "Harvest";
  if (lower.includes("fungicide") || lower.includes("pest") || lower.includes("spray") || lower.includes("neem")) return "Pest Control";
  if (lower.includes("sow") || lower.includes("plant") || lower.includes("seed"))      return "Planting";
  return "Advisory";
}

function guessRecommendationIcon(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("fertilizer") || lower.includes("basal")) return " ";
  if (lower.includes("irrigat") || lower.includes("water") || lower.includes("rainfall")) return " ";
  if (lower.includes("harvest")) return " ";
  if (lower.includes("fungicide") || lower.includes("pest") || lower.includes("spray")) return " ";
  return " ";
}

/** Build AQI crop alerts from OWM Air Pollution API response */
function buildAQIAlerts(aqiData: any): { icon: string; title: string; desc: string; severity: "high" | "medium" | "low" }[] {
  if (!aqiData?.list?.[0]) return [];
  const { main, components } = aqiData.list[0];
  const aqi: number = main?.aqi ?? 0; // 1=Good … 5=Very Poor
  const pm25: number = components?.pm2_5 ?? 0;
  const o3: number   = components?.o3    ?? 0;
  const no2: number  = components?.no2   ?? 0;
  const alerts = [];

  if (aqi >= 4) {
    alerts.push({
      icon: "🏭",
      title: "Very Poor Air Quality",
      desc: `AQI ${aqi}/5 — avoid burning crop residue. Poor air stresses plant stomata and reduces yield.`,
      severity: "high" as const,
    });
  } else if (aqi === 3) {
    alerts.push({
      icon: " ",
      title: "Moderate Air Quality",
      desc: `AQI ${aqi}/5 — limit smoke from field burning. Sensitive crops like leafy vegetables may show stress.`,
      severity: "medium" as const,
    });
  }

  if (pm25 > 35) {
    alerts.push({
      icon: " ",
      title: "High PM2.5 Particles",
      desc: `PM2.5 at ${pm25.toFixed(1)} µg/m³ — dust particles may clog leaf pores. Rinse foliage if possible.`,
      severity: pm25 > 55 ? "high" as const : "medium" as const,
    });
  }

  if (o3 > 100) {
    alerts.push({
      icon: " ",
      title: "Ozone Alert",
      desc: `O₃ at ${o3.toFixed(0)} µg/m³ — elevated ozone can cause leaf bleaching in paddy and tomato.`,
      severity: "medium" as const,
    });
  }

  if (no2 > 100) {
    alerts.push({
      icon: " ",
      title: "NO₂ Elevated",
      desc: `NO₂ at ${no2.toFixed(0)} µg/m³ — possible industrial influence. Avoid harvesting leafy crops today.`,
      severity: "medium" as const,
    });
  }

  return alerts;
}

/** Build UV alert from OWM One Call / hourly uvi field */
function buildUVAlert(uvi: number): { icon: string; title: string; desc: string; severity: "high" | "medium" | "low" } | null {
  if (uvi >= 11) return { icon: " ", title: "Extreme UV Index", desc: `UV Index ${uvi} — cover nursery seedlings with shade net. No field work 9am–4pm.`, severity: "high" };
  if (uvi >= 8)  return { icon: " ", title: "Very High UV", desc: `UV Index ${uvi} — risk of leaf scorch on tender crops. Avoid field work 10am–3pm.`, severity: "high" };
  if (uvi >= 6)  return { icon: " ", title: "High UV Index", desc: `UV Index ${uvi} — young seedlings may need shade. Wear protective clothing during field work.`, severity: "medium" };
  return null;
}

/** Build hourly irrigation schedule from OWM hourly forecast */
function buildIrrigationSchedule(hourlyData: any[]): IrrigationSlot[] {
  if (!hourlyData?.length) return [];

  // Pick morning (6am), midday (12pm), evening (5pm) slots
  const targetHours = [6, 12, 17];
  const slots: IrrigationSlot[] = [];

  for (const targetHour of targetHours) {
    const match = hourlyData.find((h: any) => {
      const hour = new Date(h.dt * 1000).getHours();
      return hour === targetHour;
    }) ?? hourlyData[0];

    if (!match) continue;

    const hour       = new Date(match.dt * 1000).getHours();
    const timeLabel  = `${String(hour).padStart(2, "0")}:00`;
    const rainChance = Math.round((match.pop ?? 0) * 100);
    const temp       = Math.round(match.temp ?? 30);
    const rain1h     = match.rain?.["1h"] ?? 0;

    let action: IrrigationSlot["action"] = "irrigate";
    let reason = "";

    if (rainChance >= 70 || rain1h > 3) {
      action = "skip";
      reason = `Rain expected (${rainChance}%) — natural watering sufficient`;
    } else if (hour >= 11 && hour <= 14 && temp > 35) {
      action = "skip";
      reason = `Peak heat at ${temp}°C — water evaporates too fast`;
    } else if (rainChance >= 40) {
      action = "optional";
      reason = `${rainChance}% rain chance — monitor and water only if dry`;
    } else if (temp > 33) {
      action = "irrigate";
      reason = `Hot & dry (${temp}°C) — irrigate to prevent wilting`;
    } else {
      action = "irrigate";
      reason = `Good conditions — ${temp}°C, low rain risk`;
    }

    slots.push({ time: timeLabel, action, reason, rainChance, temp });
  }

  return slots;
}

// ── Style maps ───────────────────────────────────────────────────────────────

const severityColor  = { high: "border-red-400 bg-red-50",    medium: "border-yellow-400 bg-yellow-50", low: "border-green-400 bg-green-50" };
const severityBadge  = { high: "bg-red-100 text-red-700",     medium: "bg-yellow-100 text-yellow-700",  low: "bg-green-100 text-green-700" };
const actionColor    = { irrigate: "bg-blue-50 border-blue-300", skip: "bg-gray-50 border-gray-200", optional: "bg-amber-50 border-amber-300" };
const actionBadge    = { irrigate: "bg-blue-100 text-blue-700", skip: "bg-gray-100 text-gray-500",   optional: "bg-amber-100 text-amber-700" };
const actionIcon     = { irrigate: " ", skip: " ", optional: " " };
const actionLabel    = { irrigate: "Irrigate", skip: "Skip", optional: "Optional" };

// ── AQI label helper ─────────────────────────────────────────────────────────
const AQI_LABELS = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
const AQI_COLORS = ["", "text-green-600", "text-lime-600", "text-yellow-600", "text-orange-600", "text-red-600"];

// ── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState("paddy");
  const [time] = useState(new Date());

  // Core dashboard data
  const [dashboard, setDashboard]           = useState<any>(null);
  const [loading, setLoading]               = useState(true);

  // New feature data
  const [aqiData, setAqiData]               = useState<any>(null);
  const [hourlyData, setHourlyData]         = useState<any>(null);
  const [aqiLoading, setAqiLoading]         = useState(true);
  const [hourlyLoading, setHourlyLoading]   = useState(true);

  useEffect(() => {
    // Existing dashboard fetch
    const fetchDashboard = async () => {
      try {
        const res  = await fetch("http://localhost:5000/dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    // New: AQI fetch
    const fetchAQI = async () => {
      try {
        const data = await getAQI();
        setAqiData(data);
      } catch (err) {
        console.error("Failed to fetch AQI:", err);
      } finally {
        setAqiLoading(false);
      }
    };

    // New: Hourly forecast fetch (UV + irrigation)
    const fetchHourly = async () => {
      try {
        const data = await getHourlyForecast();
        setHourlyData(data);
      } catch (err) {
        console.error("Failed to fetch hourly forecast:", err);
      } finally {
        setHourlyLoading(false);
      }
    };

    fetchDashboard();
    fetchAQI();
    fetchHourly();
  }, []);

  // ── Derive weather values ──────────────────────────────────────────────────
  const weatherMain      = dashboard?.weather?.main;
  const weatherCondition = dashboard?.weather?.weather?.[0];
  const weatherWind      = dashboard?.weather?.wind;

  const temp         = weatherMain?.temp     != null ? Math.round(weatherMain.temp) : "—";
  const humidity     = weatherMain?.humidity != null ? `${weatherMain.humidity}%`   : "—";
  const windSpeed    = weatherWind?.speed    != null ? `${Math.round(weatherWind.speed * 3.6)}km/h` : "—";
  const conditionLabel = weatherCondition?.main
    ? weatherCondition.main.replace(/([A-Z])/g, " $1").trim()
    : "—";

  const rainfallRaw = dashboard?.weather?.rain;
  const rainfall    = rainfallRaw ? `${rainfallRaw["1h"] ?? rainfallRaw["3h"] ?? 0}mm` : "0mm";

  // ── Derived: alerts & recommendations ─────────────────────────────────────
  const apiAlerts: any[]            = dashboard?.alerts          ?? [];
  const apiRecommendations: any[]   = dashboard?.recommendations ?? [];
  const hasApiAlerts                = apiAlerts.length > 0;

  // AQI-derived alerts
  const aqiAlerts = buildAQIAlerts(aqiData);
  const aqiValue: number | null     = aqiData?.list?.[0]?.main?.aqi ?? null;

  // UV-derived alert
  const currentUVI: number          = hourlyData?.current?.uvi ?? hourlyData?.hourly?.[0]?.uvi ?? 0;
  const uvAlert                     = buildUVAlert(currentUVI);

  // Irrigation schedule
  const irrigationSlots: IrrigationSlot[] = buildIrrigationSchedule(hourlyData?.hourly ?? []);

  // Merge all alert sources: API > UV > AQI > static
  const allAlerts = [
    ...apiAlerts,
    ...(uvAlert ? [uvAlert] : []),
    ...aqiAlerts,
  ];
  const hasAnyAlerts = allAlerts.length > 0;

  const greeting =
    time.getHours() < 12 ? "Good Morning"
    : time.getHours() < 17 ? "Good Afternoon"
    : "Good Evening";

  return (
    <div className="space-y-6 page-container">

      {/* ── Welcome Header ─────────────────────────────────────────────────── */}
      <div className="p-6 text-white bg-gradient-to-r from-forest-700 to-forest-500 rounded-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-forest-200">{greeting}</p>
            <h1 className="mt-1 text-2xl font-bold">{user?.name || "Farmer"}</h1>
            <p className="mt-1 text-sm text-forest-200" style={{ fontFamily: "Noto Sans Malayalam, sans-serif" }}>
              ഇന്നത്തെ കൃഷി വിവരങ്ങൾ
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{loading ? "…" : `${temp}°C`}</p>
            <p className="text-sm text-forest-200">{loading ? "Loading…" : conditionLabel}</p>
            <p className="text-xs text-forest-200">Kerala</p>
          </div>
        </div>

        {/* Mini forecast strip */}
        <div className="flex gap-3 pb-1 mt-5 overflow-x-auto">
          {STATIC_FORECAST.map((f) => (
            <div key={f.day} className="flex-shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center min-w-[64px]">
              <p className="text-xs text-forest-200">{f.day}</p>
              <p className="my-1 text-xl">
                {f.day === "Today" && weatherCondition?.main ? conditionIcon(weatherCondition.main) : f.icon}
              </p>
              <p className="text-xs font-bold">
                {f.day === "Today" && temp !== "—" ? `${temp}°` : `${f.high}°`}
              </p>
              <p className="text-xs text-forest-300">  {f.rain}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Humidity", value: loading ? "…" : humidity },
          { label: "Rainfall", value: loading ? "…" : rainfall },
          { label: "Wind",     value: loading ? "…" : windSpeed },
        ].map((s) => (
          <div key={s.label} className="p-3 text-center card">
            <p className="text-sm font-bold text-forest-800">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── NEW: UV Index + Air Quality Summary Bar ────────────────────────── */}
      {(!aqiLoading || !hourlyLoading) && (
        <div className="grid grid-cols-2 gap-3">
          {/* UV Index card */}
          <div className="p-3 text-center card">
            {hourlyLoading ? (
              <p className="text-sm text-gray-400">Loading UV…</p>
            ) : (
              <>
                <p className="mb-1 text-2xl">
                  {currentUVI >= 8 ? "🔥" : currentUVI >= 6 ? "☀️" : currentUVI >= 3 ? "🌤️" : "😌"}
                </p>
                <p className="text-sm font-bold text-forest-800">UV {currentUVI.toFixed(1)}</p>
                <p className="text-xs text-gray-500">
                  {currentUVI >= 11 ? "Extreme" : currentUVI >= 8 ? "Very High" : currentUVI >= 6 ? "High" : currentUVI >= 3 ? "Moderate" : "Low"}
                </p>
              </>
            )}
          </div>

          {/* AQI card */}
          <div className="p-3 text-center card">
            {aqiLoading ? (
              <p className="text-sm text-gray-400">Loading AQI…</p>
            ) : aqiValue ? (
              <>
                <p className="mb-1 text-2xl">
                  {aqiValue <= 2 ? " " : aqiValue === 3 ? " " : " "}
                </p>
                <p className={`text-sm font-bold ${AQI_COLORS[aqiValue] || "text-gray-700"}`}>
                  AQI: {AQI_LABELS[aqiValue] ?? "—"}
                </p>
                <p className="text-xs text-gray-500">Air Quality</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">No AQI data</p>
            )}
          </div>
        </div>
      )}

      {/* ── Crop Alerts (merged: API + UV + AQI + static) ─────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-forest-800">🌾 Crop Alerts</h2>
          {!hasAnyAlerts && (
            <div className="flex gap-2 overflow-x-auto">
              {Object.keys(CROP_ALERTS).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors flex-shrink-0 ${
                    selectedCrop === c ? "bg-forest-600 text-white" : "bg-forest-100 text-forest-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && aqiLoading && hourlyLoading ? (
          <p className="py-4 text-sm text-center text-gray-400">Loading alerts…</p>
        ) : hasAnyAlerts ? (
          <div className="space-y-3">
            {allAlerts.map((a: any, i: number) => {
              const sev = guessSeverity(a);
              return (
                <div key={i} className={`border-l-4 rounded-xl p-4 ${severityColor[sev]}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{a.icon ?? "⚠️"}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{a.title}</p>
                        <p className="mt-1 text-sm text-gray-600">{a.desc || a.description}</p>
                      </div>
                    </div>
                    <span className={`badge text-xs flex-shrink-0 capitalize ${severityBadge[sev]}`}>
                      {sev}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Static fallback by crop
          <div className="space-y-3">
            {(CROP_ALERTS[selectedCrop] || []).map((a, i) => (
              <div key={i} className={`border-l-4 rounded-xl p-4 ${severityColor[a.severity]}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{a.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{a.desc}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs flex-shrink-0 capitalize ${severityBadge[a.severity]}`}>
                    {a.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── NEW: Hourly Irrigation Scheduler ──────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">💧 Today's Irrigation Schedule</h2>
        {hourlyLoading ? (
          <p className="py-4 text-sm text-center text-gray-400">Building schedule…</p>
        ) : irrigationSlots.length > 0 ? (
          <div className="space-y-2">
            {irrigationSlots.map((slot, i) => (
              <div key={i} className={`border rounded-xl p-4 flex items-center gap-4 ${actionColor[slot.action]}`}>
                {/* Time */}
                <div className="text-center min-w-[52px]">
                  <p className="text-base font-bold text-gray-800">{slot.time}</p>
                  <p className="text-xs text-gray-400">{slot.temp}°C</p>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-gray-200" />

                {/* Action icon + reason */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">{actionIcon[slot.action]}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionBadge[slot.action]}`}>
                      {actionLabel[slot.action]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{slot.reason}</p>
                </div>

                {/* Rain chance */}
                <div className="text-center min-w-[40px]">
                  <p className="text-sm font-bold text-blue-500">{slot.rainChance}%</p>
                  <p className="text-xs text-gray-400">rain</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback: simple rule-based schedule when no hourly API data */
          <div className="space-y-2">
            {[
              { time: "06:00", note: "Best window — cool temperature, low evaporation" },
              { time: "17:00", note: "Evening window — avoid waterlogging overnight" },
            ].map((s, i) => (
              <div key={i} className={`border rounded-xl p-4 flex items-center gap-4 ${actionColor["irrigate"]}`}>
                <div className="text-center min-w-[52px]">
                  <p className="text-base font-bold text-gray-800">{s.time}</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-lg">💧</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionBadge["irrigate"]}`}>
                      Irrigate
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Today's Recommendations ────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">📋 Today's Recommendations</h2>
        {loading ? (
          <p className="py-4 text-sm text-center text-gray-400">Loading recommendations…</p>
        ) : apiRecommendations.length > 0 ? (
          <div className="space-y-2">
            {apiRecommendations.map((r: any, i: number) => {
              const text = r.text || r.message || r.description || JSON.stringify(r);
              const tag  = r.tag  || guessTag(text);
              const icon = r.icon || guessRecommendationIcon(text);
              return (
                <div key={i} className="flex items-start gap-3 p-4 card">
                  <span className="flex-shrink-0 text-2xl">{icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{text}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs badge bg-forest-100 text-forest-700">{tag}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-4 text-sm text-center text-gray-400">No recommendations available right now.</p>
        )}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-forest-800">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: "/voice",   label: "Ask AI",           sub: "Voice assistant" },
            { to: "/scan",    label: "Scan Crop",         sub: "Disease detection" },
            { to: "/tracker", label: "Resource Tracker",  sub: "Costs & subsidies" },
            { to: "/offline", label: "Offline Guides",    sub: "Download advice" },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="p-4 transition-all card hover:shadow-lg hover:-translate-y-1"
            >
              <p className="text-sm font-bold text-forest-700">{a.label}</p>
              <p className="text-xs text-gray-400">{a.sub}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}