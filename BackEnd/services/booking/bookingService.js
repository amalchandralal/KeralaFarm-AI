const Booking = require("../../models/Booking");

async function createBooking(userId, bookingData) {
  const { place, checkIn, checkOut } = bookingData;
  if (!place || !checkIn || !checkOut) {
    throw { status: 400, message: "Place, check-in, and check-out dates are required" };
  }

  return await Booking.create({
    ...bookingData,
    user: userId,
  });
}

async function getUserBookings(userId) {
  return await Booking.find({ user: userId }).sort({ createdAt: -1 });
}

module.exports = {
  createBooking,
  getUserBookings,
};
