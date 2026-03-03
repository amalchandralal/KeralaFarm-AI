// const axios = require("axios");
// const express = require("express");
// const app = express();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const multer = require("multer");
// const fs = require("fs");
// const imageDownloader = require("image-downloader");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const User = require("./models/User");
// const Place = require("./models/Place");
// const Booking = require("./models/Booking");

// dotenv.config();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const jwtSecret = "Navi";

// // -------------------- MONGODB CONNECTION --------------------
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     console.log("DB:", mongoose.connection.name);
//   })
//   .catch((err) => console.log("Connection Error:", err));

// // -------------------- MIDDLEWARE --------------------

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

// // -------------------- REGISTER --------------------
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({ name, email, password });
//     console.log("User Saved");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// app.get("/tts", async (req, res) => {
//   try {
//     const { text, lang = "ml" } = req.query;
//     if (!text) return res.status(400).json({ error: "No text" });

//     const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

//     const response = await fetch(url, {
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
//       },
//     });

//     const buffer = await response.arrayBuffer();
//     res.setHeader("Content-Type", "audio/mpeg");
//     res.setHeader("Cache-Control", "public, max-age=3600");
//     res.send(Buffer.from(buffer));
//   } catch (err) {
//     console.log("TTS Error:", err.message);
//     res.status(500).json({ error: "TTS failed" });
//   }
// });
// // -------------------- LOGIN --------------------
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json("User not found");

//     if (user.password !== password) {
//       return res.status(422).json("Password incorrect");
//     }

//     jwt.sign(
//       { email: user.email, id: user._id },
//       jwtSecret,
//       {},
//       (err, token) => {
//         if (err) throw err;
//         res.cookie("token", token).json(user);
//       },
//     );
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // -------------------- PROFILE --------------------
// app.get("/profile", async (req, res) => {
//   const { token } = req.cookies;
//   if (!token) return res.json("Not logged in");

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;
//     const user = await User.findById(userData.id);
//     res.json(user);
//   });
// });

// // -------------------- LOGOUT --------------------
// app.post("/logout", (req, res) => {
//   res.cookie("token", "").json(true);
// });

// // -------------------- UPLOAD --------------------
// const photosMiddleware = multer({ dest: "uploads/" });

// app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
//   const uploadedFiles = [];

//   for (let i = 0; i < req.files.length; i++) {
//     const { path, originalname } = req.files[i];
//     const ext = originalname.split(".").pop();
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//     uploadedFiles.push(newPath.replace("uploads/", ""));
//   }

//   res.json(uploadedFiles);
// });
// // -------------------- PLANT DISEASE DETECTION (GEMINI) --------------------

// // Define the structure we want the AI to follow
// const diseaseSchema = {
//   type: "object",
//   properties: {
//     disease_name: { type: "string" },
//     possible_causes: { type: "string" },
//     suggested_treatment: { type: "string" },
//     fertilizer_guidance: { type: "string" },
//     confidence_level: { type: "string" },
//   },
//   required: ["disease_name", "possible_causes", "suggested_treatment"],
// };

// app.post(
//   "/detect-disease",
//   photosMiddleware.single("image"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No image uploaded" });
//       }

//       // 1. Read image from /uploads folder
//       const imageBuffer = fs.readFileSync(req.file.path);
//       const base64Image = imageBuffer.toString("base64");

//       // 2. Initialize Model with System Instructions & JSON Config
//       const model = genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//         systemInstruction:
//           "You are an expert plant pathologist. Analyze crop images. If a disease is found, provide details. If the plant is healthy, indicate that. Always return response in JSON.",
//         generationConfig: {
//           responseMimeType: "application/json",
//           responseSchema: diseaseSchema,
//         },
//       });

//       // 3. Send request
//       const result = await model.generateContent([
//         {
//           inlineData: {
//             mimeType: req.file.mimetype,
//             data: base64Image,
//           },
//         },
//         "Identify the plant disease in this image and provide treatment and fertilizer guidance.",
//       ]);

//       const response = await result.response;
//       const jsonResponse = JSON.parse(response.text());

//       // 4. Cleanup: Delete the temporary file from /uploads after processing
//       fs.unlinkSync(req.file.path);

//       // 5. Return JSON to frontend
//       res.json(jsonResponse);
//     } catch (err) {
//       console.error("Gemini Error:", err.message);
//       res
//         .status(500)
//         .json({ error: "Failed to analyze image. Please try again." });
//     }
//   },
// );
// // -------------------- GET ALL PLACES --------------------
// app.get("/places", async (req, res) => {
//   res.json(await Place.find());
// });

// // -------------------- BOOKINGS --------------------
// app.post("/bookings", async (req, res) => {
//   try {
//     const { token } = req.cookies;

//     jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//       if (err) throw err;

//       const booking = await Booking.create({
//         ...req.body,
//         user: userData.id,
//       });

//       res.json(booking);
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/bookings", async (req, res) => {
//   const { token } = req.cookies;

//   jwt.verify(token, jwtSecret, {}, async (err, userData) => {
//     if (err) throw err;
//     res.json(await Booking.find({ user: userData.id }).populate("place"));
//   });
// });

// // -------------------- VOICE ASSISTANT --------------------

// app.post("/voice-assistant", async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: "No question provided" });
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash",
//       systemInstruction: `
//       You are an AI farming assistant for Kerala farmers.
//       Answer in simple Malayalam if possible.
//       Give short and clear farming advice.
//       `,
//     });

//     const result = await model.generateContent(`Farmer Question: ${question}`);

//     const response = await result.response;
//     const answer = response.text();

//     res.json({
//       question,
//       answer,
//     });
//   } catch (err) {
//     console.log("Voice Assistant Error:", err.message);

//     res.status(500).json({
//       error: "Failed to process voice query",
//     });
//   }
// });
// //translation//
// app.post("/translate", async (req, res) => {
//   try {
//     const { text, field } = req.body;

//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const result = await model.generateContent(
//       `Translate this to Malayalam. Return only the translated text, nothing else:\n\n${text}`,
//     );

//     res.json({ translated: result.response.text().trim() });
//   } catch (err) {
//     res.status(500).json({ error: "Translation failed" });
//   }
// });
// //whether //
// app.get("/dashboard", async (req, res) => {
//   try {
//     const weatherRes = await axios.get(
//       `https://api.openweathermap.org/data/2.5/weather?lat=10.8505&lon=76.2711&appid=${process.env.WEATHER_KEY}&units=metric`,
//     );

//     const w = weatherRes.data;
//     const temp = w.main.temp;
//     const humidity = w.main.humidity;
//     const windSpeed = w.wind.speed * 3.6;
//     const rainfall = w.rain?.["1h"] ?? w.rain?.["3h"] ?? 0;
//     const condition = w.weather[0].main;
//     const clouds = w.clouds.all;

//     const alerts = [];
//     const recommendations = [];

//     // Alerts
//     if (humidity > 80)
//       alerts.push({
//         title: "Stem Borer Alert",
//         desc: "High humidity increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.",
//         severity: "high",
//       });

//     if (humidity > 75 && clouds > 60)
//       alerts.push({
//         title: "Blast Disease Risk",
//         desc: "Cloudy and humid — ideal for rice blast. Use Tricyclazole spray preventively.",
//         severity: "medium",
//       });

//     if (condition === "Rain" || condition === "Thunderstorm" || rainfall > 10)
//       alerts.push({
//         title: "Waterlogging Warning",
//         desc: "Heavy rainfall detected. Ensure drainage channels are clear to prevent root rot.",
//         severity: "high",
//       });

//     if (temp > 35)
//       alerts.push({
//         title: "Heat Stress Alert",
//         desc: `Temperature at ${Math.round(temp)}°C. Avoid field work 11am–3pm. Increase irrigation frequency.`,
//         severity: "high",
//       });

//     if (windSpeed > 25)
//       alerts.push({
//         title: "High Wind Warning",
//         desc: `Wind at ${Math.round(windSpeed)} km/h. Avoid spraying — drift risk.`,
//         severity: "medium",
//       });

//     if (temp > 32 && humidity < 50 && condition === "Clear")
//       alerts.push({
//         title: "Rhinoceros Beetle Risk",
//         desc: "Dry and hot — check coconut crown for beetle damage.",
//         severity: "medium",
//       });

//     if (
//       humidity > 80 &&
//       temp > 25 &&
//       (condition === "Rain" || condition === "Drizzle")
//     )
//       alerts.push({
//         title: "Fungal Risk High",
//         desc: "Wet and warm — apply copper fungicide to tomato and brinjal.",
//         severity: "high",
//       });

//     // Recommendations
//     if (condition === "Clouds" || clouds > 50)
//       recommendations.push({
//         text: "Good time to apply basal fertilizer to paddy before rain.",
//         tag: "Fertilizer",
//       });

//     if (condition === "Rain" || condition === "Drizzle" || rainfall > 5)
//       recommendations.push({
//         text: `Skip irrigation today — natural rainfall of ${rainfall > 0 ? rainfall + "mm" : "rain"} expected.`,
//         tag: "Water",
//       });
//     else if (temp > 35 && humidity < 40)
//       recommendations.push({
//         text: "Hot and dry — increase irrigation frequency to prevent crop wilting.",
//         tag: "Water",
//       });

//     if (rainfall > 15 || condition === "Thunderstorm")
//       recommendations.push({
//         text: "Heavy rainfall detected. Harvest ripe vegetables now to avoid damage.",
//         tag: "Harvest",
//       });

//     if (humidity > 70 && (condition === "Clouds" || condition === "Drizzle"))
//       recommendations.push({
//         text: "Apply fungicide spray before forecast rainfall.",
//         tag: "Pest Control",
//       });

//     if (condition === "Clear" && windSpeed < 15)
//       recommendations.push({
//         text: "Clear skies and calm wind — ideal conditions for pesticide or fertilizer spraying.",
//         tag: "Pest Control",
//       });

//     if (temp > 34)
//       recommendations.push({
//         text: `High temperature (${Math.round(temp)}°C) — apply mulch around crops to retain soil moisture.`,
//         tag: "Advisory",
//       });

//     res.json({ weather: w, alerts, recommendations });
//   } catch (err) {
//     console.log(err.response?.data);
//     res.status(500).json({ error: "Weather API failed" });
//   }
// });

// // -------------------- SERVER --------------------
// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });
const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const imageDownloader = require("image-downloader");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const InputEntry = require("./models/inputEntry");

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const jwtSecret = "Navi";

// -------------------- MONGODB CONNECTION --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("DB:", mongoose.connection.name);
  })
  .catch((err) => console.log("Connection Error:", err));

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// -------------------- AUTH HELPER --------------------
const getUserFromToken = (req) => {
  return new Promise((resolve, reject) => {
    const { token } = req.cookies;
    if (!token) return reject(new Error("Not logged in"));
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
};

// -------------------- REGISTER --------------------
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password });
    console.log("User Saved");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- TTS --------------------
app.get("/tts", async (req, res) => {
  try {
    const { text, lang = "ml" } = req.query;
    if (!text) return res.status(400).json({ error: "No text" });
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.log("TTS Error:", err.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");
    if (user.password !== password) return res.status(422).json("Password incorrect");
    jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json(user);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- PROFILE --------------------
app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json("Not logged in");
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const user = await User.findById(userData.id);
    res.json(user);
  });
});

// -------------------- LOGOUT --------------------
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// -------------------- UPLOAD --------------------
const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const ext = originalname.split(".").pop();
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

// -------------------- PLANT DISEASE DETECTION --------------------
const diseaseSchema = {
  type: "object",
  properties: {
    disease_name:        { type: "string" },
    possible_causes:     { type: "string" },
    suggested_treatment: { type: "string" },
    fertilizer_guidance: { type: "string" },
    confidence_level:    { type: "string" },
  },
  required: ["disease_name", "possible_causes", "suggested_treatment"],
};

app.post("/detect-disease", photosMiddleware.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert plant pathologist. Analyze crop images. If a disease is found, provide details. If the plant is healthy, indicate that. Always return response in JSON.",
      generationConfig: { responseMimeType: "application/json", responseSchema: diseaseSchema },
    });
    const result = await model.generateContent([
      { inlineData: { mimeType: req.file.mimetype, data: base64Image } },
      "Identify the plant disease in this image and provide treatment and fertilizer guidance.",
    ]);
    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());
    fs.unlinkSync(req.file.path);
    res.json(jsonResponse);
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Failed to analyze image. Please try again." });
  }
});

// -------------------- PLACES --------------------
app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

// -------------------- BOOKINGS --------------------
app.post("/bookings", async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const booking = await Booking.create({ ...req.body, user: userData.id });
      res.json(booking);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/bookings", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    res.json(await Booking.find({ user: userData.id }).populate("place"));
  });
});

// -------------------- VOICE ASSISTANT --------------------
app.post("/voice-assistant", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are an AI farming assistant for Kerala farmers. Answer in simple Malayalam if possible. Give short and clear farming advice.`,
    });
    const result = await model.generateContent(`Farmer Question: ${question}`);
    const answer = result.response.text();
    res.json({ question, answer });
  } catch (err) {
    console.log("Voice Assistant Error:", err.message);
    res.status(500).json({ error: "Failed to process voice query" });
  }
});

// -------------------- TRANSLATION --------------------
app.post("/translate", async (req, res) => {
  try {
    const { text } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `Translate this to Malayalam. Return only the translated text, nothing else:\n\n${text}`
    );
    res.json({ translated: result.response.text().trim() });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
});

// -------------------- WEATHER / DASHBOARD --------------------
app.get("/dashboard", async (req, res) => {
  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=10.8505&lon=76.2711&appid=${process.env.WEATHER_KEY}&units=metric`
    );
    const w = weatherRes.data;
    const temp = w.main.temp;
    const humidity = w.main.humidity;
    const windSpeed = w.wind.speed * 3.6;
    const rainfall = w.rain?.["1h"] ?? w.rain?.["3h"] ?? 0;
    const condition = w.weather[0].main;
    const clouds = w.clouds.all;

    const alerts = [];
    const recommendations = [];

    if (humidity > 80) alerts.push({ title: "Stem Borer Alert", desc: "High humidity increases stem borer risk in paddy. Apply Chlorpyrifos 2.5ml/L if observed.", severity: "high" });
    if (humidity > 75 && clouds > 60) alerts.push({ title: "Blast Disease Risk", desc: "Cloudy and humid — ideal for rice blast. Use Tricyclazole spray preventively.", severity: "medium" });
    if (condition === "Rain" || condition === "Thunderstorm" || rainfall > 10) alerts.push({ title: "Waterlogging Warning", desc: "Heavy rainfall detected. Ensure drainage channels are clear to prevent root rot.", severity: "high" });
    if (temp > 35) alerts.push({ title: "Heat Stress Alert", desc: `Temperature at ${Math.round(temp)}°C. Avoid field work 11am–3pm. Increase irrigation frequency.`, severity: "high" });
    if (windSpeed > 25) alerts.push({ title: "High Wind Warning", desc: `Wind at ${Math.round(windSpeed)} km/h. Avoid spraying — drift risk.`, severity: "medium" });
    if (temp > 32 && humidity < 50 && condition === "Clear") alerts.push({ title: "Rhinoceros Beetle Risk", desc: "Dry and hot — check coconut crown for beetle damage.", severity: "medium" });
    if (humidity > 80 && temp > 25 && (condition === "Rain" || condition === "Drizzle")) alerts.push({ title: "Fungal Risk High", desc: "Wet and warm — apply copper fungicide to tomato and brinjal.", severity: "high" });

    if (condition === "Clouds" || clouds > 50) recommendations.push({ text: "Good time to apply basal fertilizer to paddy before rain.", tag: "Fertilizer" });
    if (condition === "Rain" || condition === "Drizzle" || rainfall > 5) recommendations.push({ text: `Skip irrigation today — natural rainfall of ${rainfall > 0 ? rainfall + "mm" : "rain"} expected.`, tag: "Water" });
    else if (temp > 35 && humidity < 40) recommendations.push({ text: "Hot and dry — increase irrigation frequency to prevent crop wilting.", tag: "Water" });
    if (rainfall > 15 || condition === "Thunderstorm") recommendations.push({ text: "Heavy rainfall detected. Harvest ripe vegetables now to avoid damage.", tag: "Harvest" });
    if (humidity > 70 && (condition === "Clouds" || condition === "Drizzle")) recommendations.push({ text: "Apply fungicide spray before forecast rainfall.", tag: "Pest Control" });
    if (condition === "Clear" && windSpeed < 15) recommendations.push({ text: "Clear skies and calm wind — ideal conditions for pesticide or fertilizer spraying.", tag: "Pest Control" });
    if (temp > 34) recommendations.push({ text: `High temperature (${Math.round(temp)}°C) — apply mulch around crops to retain soil moisture.`, tag: "Advisory" });

    res.json({ weather: w, alerts, recommendations });
  } catch (err) {
    console.log(err.response?.data);
    res.status(500).json({ error: "Weather API failed" });
  }
});

// ==================== RESOURCE TRACKER ====================

// GET all entries for logged-in user
app.get("/input-entries", async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const entries = await InputEntry.find({ user: userData.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// POST create new entry
app.post("/input-entries", async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const { date, category, item, quantity, unit, cost, notes } = req.body;
    if (!item || !cost) return res.status(400).json({ error: "Item and cost are required" });
    const entry = await InputEntry.create({
      user: userData.id,
      date, category, item, quantity, unit,
      cost: Number(cost),
      notes,
    });
    res.json(entry);
  } catch (err) {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// DELETE entry by id
app.delete("/input-entries/:id", async (req, res) => {
  try {
    const userData = await getUserFromToken(req);
    const entry = await InputEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    if (entry.user.toString() !== userData.id) return res.status(403).json({ error: "Not authorized" });
    await InputEntry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: "Not authenticated" });
  }
});
console.log("API KEY:", process.env.DATA_GOV_KEY);
//market price//
// -------------------- MARKET PRICES --------------------
app.get("/market-prices", async (req, res) => {
  try {
    const state = "Kerala"
    // const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_KEY}&format=json&filters[state.keyword]=${state}&limit=50`
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${process.env.DATA_GOV_KEY}&format=json&filters[state]=${state}&limit=50`;

    const response = await axios.get(url)
    const records = response.data.records || []

    const prices = records.map(r => ({
      crop:   r.commodity,
      market: r.market,
      min:    r.min_price,
      max:    r.max_price,
      modal:  r.modal_price,
      unit:   '/quintal',
      date:   r.arrival_date,
    }))

    res.json(prices)
  } catch (err) {
    console.error("Market prices error:", err.message)
    res.status(500).json({ error: "Failed to fetch market prices" })
  }
})

// -------------------- SERVER --------------------
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});