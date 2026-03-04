const express = require("express");
const router = express.Router();
const { getPlaces } = require("../controllers/placeController");
const { createBooking, getBookings } = require("../controllers/bookingController");
const { getDashboard,getAQI,getHourlyForecast } = require("../controllers/dashboardController");
const { getMarketPrices } = require("../controllers/marketController");
const { getEntries, createEntry, deleteEntry } = require("../controllers/inputEntryController");
const { getTTS } = require("../controllers/ttsController");

router.get("/places", getPlaces);

router.post("/bookings", createBooking);
router.get("/bookings", getBookings);

router.get("/dashboard", getDashboard);
router.get("/dashboard/aqi", getAQI);
router.get("/dashboard/hourly", getHourlyForecast)

router.get("/market-prices", getMarketPrices);

router.get("/input-entries", getEntries);
router.post("/input-entries", createEntry);
router.delete("/input-entries/:id", deleteEntry);

router.get("/tts", getTTS);

module.exports = router;