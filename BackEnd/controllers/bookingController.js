const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const { JWT_SECRET } = require("../utils/constants");

const createBooking = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    try {
      const booking = await Booking.create({ ...req.body, user: userData.id });
      res.json(booking);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

const getBookings = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, JWT_SECRET, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    res.json(await Booking.find({ user: userData.id }).populate("place"));
  });
};

module.exports = { createBooking, getBookings };