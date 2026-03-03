const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place:     { type: String, required: true },   // place name (string, not ObjectId)
  user:      { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn:   { type: Date, required: true },
  checkOut:  { type: Date, required: true },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  price:     Number,
  status:    { type: String, default: 'pending' },
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;