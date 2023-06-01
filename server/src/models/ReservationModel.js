// FIXME: Add a Mongoose model here
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
  partySize: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  restaurantName: { type: String, required: true },
});

const Reservation = mongoose.model('reservation', reservationSchema);
module.exports = Reservation;
