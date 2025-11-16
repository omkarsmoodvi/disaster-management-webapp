const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: String,
  address: String,
  hotline: String,
  email: String,
  type: String,
  seats: Number,
  latitude: Number,
  longitude: Number
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;
