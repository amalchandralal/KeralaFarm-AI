const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const { getPlaces } = require("../controllers/placeController");
const {
  createBooking,
  getBookings,
} = require("../controllers/bookingController");
const {
  getDashboard,
  getAQI,
  getHourlyForecast,
} = require("../controllers/dashboardController");
const { getMarketPrices } = require("../controllers/marketController");
const {
  getEntries,
  createEntry,
  deleteEntry,
} = require("../controllers/inputEntryController");
const { getTTS } = require("../controllers/ttsController");

// Public routes
router.get("/places", getPlaces);
router.get("/dashboard", getDashboard);
router.get("/aqi", getAQI);
router.get("/forecast/hourly", getHourlyForecast);
router.get("/market-prices", getMarketPrices);
router.get("/tts", getTTS);

// Protected routes — require authentication
router.post("/bookings", requireAuth, createBooking);
router.get("/bookings", requireAuth, getBookings);

router.get("/input-entries", requireAuth, getEntries);
router.post("/input-entries", requireAuth, createEntry);
router.delete("/input-entries/:id", requireAuth, deleteEntry);

module.exports = router;