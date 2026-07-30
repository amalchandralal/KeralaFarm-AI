const axios = require("axios");
const https = require("https");

// Required: user's network/proxy injects a self-signed certificate into HTTPS
const tlsAgent = new https.Agent({ rejectUnauthorized: false });

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

// Small delay to respect Nominatim's rate-limit (1 req/sec)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nominatimGet = async (url, userAgent, retries = 3) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": userAgent,
          Accept: "application/json",
        },
        httpsAgent: tlsAgent,
        timeout: 10000,
      });
      return response;
    } catch (err) {
      const is429 = err.response && err.response.status === 429;
      if (is429 && attempt < retries) {
        const backoff = (attempt + 1) * 2000; // 2s, 4s, 6s
        console.log(`Nominatim rate-limited (429). Retrying in ${backoff}ms...`);
        await delay(backoff);
        continue;
      }
      throw err;
    }
  }
};

const buildSearchUrl = (q, opts = {}) => {
  const params = new URLSearchParams({
    q,
    format: "json",
    addressdetails: "1",
    limit: opts.limit || "40",
    countrycodes: "in",
  });

  if (opts.viewbox) {
    params.append("viewbox", opts.viewbox);
    if (opts.bounded) params.append("bounded", "1");
  }

  return `https://nominatim.openstreetmap.org/search?${params.toString()}`;
};

const getPlaces = async (req, res) => {
  try {
    const { lat, lon, city } = req.query;
    const userAgent = "KeralaFarmAI_Assistant_System_v1";

    let targetLat = lat ? parseFloat(lat) : NaN;
    let targetLon = lon ? parseFloat(lon) : NaN;
    let cityLabel = "";
    let cityBoundingBox = null;

    if (city) {
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        city + ", India",
      )}&format=json&limit=1&countrycodes=in`;

      const geoRes = await nominatimGet(geoUrl, userAgent);

      if (geoRes.data && geoRes.data.length > 0) {
        targetLat = parseFloat(geoRes.data[0].lat);
        targetLon = parseFloat(geoRes.data[0].lon);
        cityLabel = geoRes.data[0].display_name.split(",")[0].trim();
        cityBoundingBox = geoRes.data[0].boundingbox || null;
      } else {
        return res.status(404).json({ error: "City not found" });
      }
    }

    if (!city && (isNaN(targetLat) || isNaN(targetLon))) {
      return res.status(400).json({
        error: "Please provide either latitude/longitude or a city for search.",
      });
    }

    const bounding = cityBoundingBox
      ? `${cityBoundingBox[2]},${cityBoundingBox[1]},${cityBoundingBox[3]},${cityBoundingBox[0]}`
      : !isNaN(targetLat) && !isNaN(targetLon)
        ? `${targetLon - 0.3},${targetLat + 0.3},${targetLon + 0.3},${targetLat - 0.3}`
        : null;

    const queries = cityLabel
      ? [
          `${cityLabel} Agriculture Office`,
          `${cityLabel} Krishi Bhavan`,
          `${cityLabel} Agriculture Department`,
        ]
      : [
          "Agriculture Office India",
          "Krishi Bhavan India",
          "Agriculture Department India",
        ];

    const results = [];
    const seen = new Set();

    const saveResults = (items) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (!item || !item.lat || !item.lon) return;
        const id = item.place_id || `${item.osm_type}/${item.osm_id}`;
        if (seen.has(id)) return;
        seen.add(id);

        const name =
          item.display_name?.split(",")[0] ||
          item.name ||
          "Agricultural Office";
        const address = item.display_name
          ? item.display_name.split(",").slice(1, 4).join(",").trim()
          : "Address not available";

        results.push({
          id,
          name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          address,
        });
      });
    };

    // Primary queries
    for (const query of queries) {
      const url = buildSearchUrl(query, {
        viewbox: bounding,
        bounded: Boolean(bounding),
      });
      try {
        const response = await nominatimGet(url, userAgent);
        saveResults(response.data);
      } catch (innerError) {
        console.error(
          `Nominatim search failed for "${query}":`,
          innerError.message,
        );
      }
      await delay(1100); // Respect Nominatim rate limit
    }

    // Fallback queries if nothing found
    if (results.length === 0) {
      const fallbackQueries = cityLabel
        ? [
            `${cityLabel} Krishi Bhavan India`,
            `${cityLabel} Agriculture Office India`,
          ]
        : ["Krishi Bhavan India", "Agriculture Office India"];

      for (const query of fallbackQueries) {
        try {
          const response = await nominatimGet(
            buildSearchUrl(query, { limit: "40" }),
            userAgent,
          );
          saveResults(response.data);
        } catch (innerError) {
          console.error(
            `Fallback search failed for "${query}":`,
            innerError.message,
          );
        }
        await delay(1100);
      }
    }

    const sorted = results
      .map((place) => ({
        ...place,
        distance: haversineKm(targetLat, targetLon, place.lat, place.lon),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 11);

    res.json({
      places: sorted,
      center: [targetLat, targetLon],
    });
  } catch (error) {
    console.error("Place Controller Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    res.status(500).json({
      error: "Backend failed to process request",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { getPlaces };
