const Booking = require("../models/Booking");

const createBooking = async (req, res) => {
  try {
    const { place, checkIn, checkOut, guests } = req.body;
    if (!place || !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ error: "Place, check-in, and check-out dates are required" });
    }
    const booking = await Booking.create({
      ...req.body,
      user: req.userData.id,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookings = async (req, res) => {
  try {
    // Note: "place" is a String field, not an ObjectId ref, so .populate() is not used.
    const bookings = await Booking.find({ user: req.userData.id }).sort({
      createdAt: -1,
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createBooking, getBookings };