const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const apiRoutes = require("./routes/mainRoutes");

const app = express();

// -------------------- DB --------------------
connectDB();

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// -------------------- ROUTES --------------------
app.use("/", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/", aiRoutes);
app.use("/", apiRoutes);

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});