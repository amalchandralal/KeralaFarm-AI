const bookingService = require("../services/booking/bookingService");

const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.userData.id, req.body);
    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.userData.id);
    res.json(bookings);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
};

module.exports = { createBooking, getBookings };