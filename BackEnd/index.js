const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const logger = require("./utils/logger");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const apiRoutes = require("./routes/mainRoutes");

const app = express();

// -------------------- DB --------------------
connectDB();

// -------------------- MIDDLEWARE --------------------
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

// -------------------- ROUTES --------------------
app.use("/api", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", aiRoutes);
app.use("/api", apiRoutes);

// -------------------- GLOBAL ERROR HANDLER --------------------
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});