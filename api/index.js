


const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const imageDownloader = require('image-downloader');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const User = require('./models/User');
const Place = require('./models/Place');
const Booking = require('./models/Booking');

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const jwtSecret = "Navi";

// -------------------- MONGODB CONNECTION --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    console.log("DB:", mongoose.connection.name);
  })
  .catch(err => console.log("Connection Error:", err));

// -------------------- MIDDLEWARE --------------------
app.use(cors({
  credentials: true,
  origin: ['http://localhost:8000'],
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// -------------------- TEST ROUTE --------------------
app.get('/test', (req, res) => {
  res.send('Hello World');
});

// -------------------- REGISTER --------------------
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    console.log("User Saved");
    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN --------------------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    if (user.password !== password) {
      return res.status(422).json("Password incorrect");
    }

    jwt.sign(
      { email: user.email, id: user._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(user);
      }
    );

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- PROFILE --------------------
app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json("Not logged in");

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const user = await User.findById(userData.id);
    res.json(user);
  });
});

// -------------------- LOGOUT --------------------
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// -------------------- UPLOAD --------------------
const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const ext = originalname.split('.').pop();
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ""));
  }

  res.json(uploadedFiles);
});
// -------------------- PLANT DISEASE DETECTION (GEMINI) --------------------

// Define the structure we want the AI to follow
const diseaseSchema = {
  type: "object",
  properties: {
    disease_name: { type: "string" },
    possible_causes: { type: "string" },
    suggested_treatment: { type: "string" },
    fertilizer_guidance: { type: "string" },
    confidence_level: { type: "string" }
  },
  required: ["disease_name", "possible_causes", "suggested_treatment"]
};

app.post('/detect-disease', photosMiddleware.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // 1. Read image from /uploads folder
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    // 2. Initialize Model with System Instructions & JSON Config
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are an expert plant pathologist. Analyze crop images. If a disease is found, provide details. If the plant is healthy, indicate that. Always return response in JSON.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: diseaseSchema,
      }
    });

    // 3. Send request
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: req.file.mimetype,
          data: base64Image,
        },
      },
      "Identify the plant disease in this image and provide treatment and fertilizer guidance."
    ]);

    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    // 4. Cleanup: Delete the temporary file from /uploads after processing
    fs.unlinkSync(req.file.path);

    // 5. Return JSON to frontend
    res.json(jsonResponse);

  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "Failed to analyze image. Please try again." });
  }
});
// -------------------- GET ALL PLACES --------------------
app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

// -------------------- BOOKINGS --------------------
app.post('/bookings', async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;

      const booking = await Booking.create({
        ...req.body,
        user: userData.id
      });

      res.json(booking);
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bookings', async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    res.json(await Booking.find({ user: userData.id }).populate('place'));
  });
});
// -------------------- LIST GEMINI MODELS (DEBUG) --------------------
app.get('/list-models', async (req, res) => {
  try {
    const models = await genAI.listModels();
    console.log(models);
    res.json(models);
  } catch (err) {
    console.log("List Models Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- SERVER --------------------
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});